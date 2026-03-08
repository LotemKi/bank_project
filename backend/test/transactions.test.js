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

jest.unstable_mockModule("../src/repositories/mongo/user.repository.js", () => {
    const mock = {
        debitIfSufficient: jest.fn(),
        incrementBalance: jest.fn(),
    };
    return {
        ...mock,
        default: mock,
    };
});

jest.unstable_mockModule("../src/repositories/mongo/transaction.repository.js", () => {
    const mock = {
        createTransaction: jest.fn(),
        getByUserEmail: jest.fn(),
        findById: jest.fn(),
    };
    return {
        ...mock,
        default: mock,
    };
});

jest.unstable_mockModule("../src/services/counter.service.js", () => ({
    getNextId: jest.fn(),
}));

/* ================= IMPORT AFTER MOCKS ================= */

const controllerModule = await import("../src/controller/transaction.controller.js");
const {
    getTransactions,
    getTransactionById,
    createTransaction: createTransactionController
} = controllerModule;

const { debitIfSufficient, incrementBalance } = await import("../src/repositories/mongo/user.repository.js");
const { createTransaction: createTransactionRepo, getByUserEmail, findById } = await import("../src/repositories/mongo/transaction.repository.js");
const { default: Transactions } = await import("../src/db_models/transaction.model.js");
const { default: User } = await import("../src/db_models/user.model.js");

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

        getByUserEmail.mockResolvedValue({
            transactions: mockTransactions,
            total: 1
        });

        const req = { user: { email: "a@mail.com" }, query: {} };
        const res = { json: jest.fn() };

        await getTransactions(req, res);

        expect(getByUserEmail).toHaveBeenCalledWith("a@mail.com", { offset: 0, limit: 500 });
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
        debitIfSufficient.mockResolvedValue(true);
        incrementBalance.mockResolvedValue(true);

        createTransactionRepo.mockResolvedValue({
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

        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await createTransactionController(req, res);

        expect(debitIfSufficient).toHaveBeenCalledWith("sender@mail.com", 100);
        expect(incrementBalance).toHaveBeenCalledWith("receiver@mail.com", 100);
        expect(createTransactionRepo).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
    });

    it("returns error if insufficient funds", async () => {
        debitIfSufficient.mockResolvedValue(false);

        const req = {
            user: { email: "sender@mail.com" },
            body: { toAccount: "receiver@mail.com", amount: 100 }
        };

        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await createTransactionController(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            success: false,
            error: 'Insufficient funds'
        }));
    });

    /* ================= GET TRANSACTION BY ID ================= */

    it("returns transaction by id", async () => {
        const tx = { id: 1, fromEmail: "a@mail.com", toEmail: "b@mail.com" };

        findById.mockResolvedValue(tx);

        const req = { params: { transactionId: 1 }, user: { email: "a@mail.com" } };
        const res = { json: jest.fn() };

        await getTransactionById(req, res);

        expect(findById).toHaveBeenCalledWith(1);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: tx
        });
    });

});