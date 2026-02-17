import { jest } from "@jest/globals";

jest.unstable_mockModule("../src/db_models/user.model.js", () => ({
    default: {
        findOne: jest.fn(),
        create: jest.fn(),
        deleteOne: jest.fn(),
    },
}));

jest.unstable_mockModule("../src/mailer/auth.mailer.js", () => ({
    sendVerificationMail: jest.fn(),
}));

jest.unstable_mockModule("bcryptjs", () => ({
    default: {
        hash: jest.fn(),
        compare: jest.fn(),
    },
}));

const authControllerModule = await import("../src/controller/auth.controller.js");
const authController = authControllerModule.default;

const { default: User } = await import("../src/db_models/user.model.js");
const mailer = await import("../src/mailer/auth.mailer.js");
const bcrypt = await import("bcryptjs");

describe("POST /signup (controller)", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("creates user successfully", async () => {
        User.findOne.mockResolvedValue(null);
        bcrypt.default.hash.mockResolvedValue("hashed");
        User.create.mockResolvedValue({ id: "123", email: "test@mail.com" });
        mailer.sendVerificationMail.mockResolvedValue();

        const req = {
            body: {
                email: "test@mail.com",
                password: "123456",
                firstName: "Lotem",
                lastName: "K",
                phone: "123",
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        await authController.signup(req, res);

        expect(User.findOne).toHaveBeenCalledWith({ email: "test@mail.com" });
        expect(User.create).toHaveBeenCalled();
        expect(mailer.sendVerificationMail).toHaveBeenCalledWith("test@mail.com", "123");
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });
});
