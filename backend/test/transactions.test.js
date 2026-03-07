import { jest } from "@jest/globals";

/* ================= MOCKS ================= */

jest.unstable_mockModule("../src/db_models/transaction.model.js", () => ({
    default: {
        find: jest.fn(),
        countDocuments: jest.fn(),
        create: jest.fn(),
        findOne: jest.fn(),
    },
}));

jest.unstable_mockModule("../src/db_models/user.model.js", () => ({
    default: {
        updateOne: jest.fn(),
    },
}));

jest.unstable_mockModule("../src/services/counter.service.js", () => ({
    getNextId: jest.fn(),
}));

/* ================= IMPORT AFTER MOCKS ================= */

const controllerModule = await import("../src/controller/transaction.controller.js");
const { getTransactions, createTransaction, getTransactionById } = controllerModule;

const { default: Transactions } = await import("../src/db_models/transaction.model.js");
const { default: User } = await import("../src/db_models/user.model.js");
const { getNextId } = await import("../src/services/counter.service.js");

/* ================= TESTS ================= */

describe("Transactions Controller", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    /* ================= GET TRANSACTIONS ================= */

    it("returns transactions for the user", async () => {

        const mockTransactions = [
            { id: 1, fromEmail: "a@mail.com", toEmail: "b@mail.com", amount: 100 },
        ];

        Transactions.find.mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue(mockTransactions),
        });

        Transactions.countDocuments.mockResolvedValue(1);

        const req = {
            user: { email: "a@mail.com" },
            query: {}
        };

        const res = {
            json: jest.fn()
        };

        await getTransactions(req, res);

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: {
                transactions: mockTransactions,
                total: 1,
                offset: 0,
                limit: 500
            }
        });

    });

    /* ================= CREATE TRANSACTION ================= */

    it("creates transaction successfully", async () => {

        User.updateOne
            .mockResolvedValueOnce({ modifiedCount: 1 }) // debit sender
            .mockResolvedValueOnce({ modifiedCount: 1 }); // credit receiver

        getNextId.mockResolvedValue(10);

        Transactions.create.mockResolvedValue({
            id: 10,
            amount: 100,
            createdAt: new Date()
        });

        const req = {
            user: { email: "sender@mail.com" },
            body: {
                toAccount: "receiver@mail.com",
                amount: 100,
                description: "test transfer"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await createTransaction(req, res);

        expect(User.updateOne).toHaveBeenCalledTimes(2);
        expect(Transactions.create).toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledWith(201);

    });

    /* ================= INSUFFICIENT FUNDS ================= */

    it("returns error if insufficient funds", async () => {

        User.updateOne.mockResolvedValue({ modifiedCount: 0 });

        const req = {
            user: { email: "sender@mail.com" },
            body: {
                toAccount: "receiver@mail.com",
                amount: 100
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await createTransaction(req, res);

        expect(res.status).toHaveBeenCalledWith(400);

    });

    /* ================= GET TRANSACTION BY ID ================= */

    it("returns transaction by id", async () => {

        const tx = {
            id: 1,
            fromEmail: "a@mail.com",
            toEmail: "b@mail.com"
        };

        Transactions.findOne.mockReturnValue({
            lean: jest.fn().mockResolvedValue(tx)
        });

        const req = {
            params: { transactionId: 1 },
            user: { email: "a@mail.com" }
        };

        const res = {
            json: jest.fn()
        };

        await getTransactionById(req, res);

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: tx
        });

    });

});