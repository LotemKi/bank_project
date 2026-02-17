import { jest } from "@jest/globals";

jest.unstable_mockModule("../src/db_models/user.model.js", () => ({
    default: {
        findOne: jest.fn(),
    },
}));

jest.unstable_mockModule("bcryptjs", () => ({
    compare: jest.fn(),
}));

jest.unstable_mockModule("../src/utils/jwt.js", () => ({
    signToken: jest.fn(),
}));

const authControllerModule = await import("../src/controller/auth.controller.js");
const authController = authControllerModule.default;

const { default: User } = await import("../src/db_models/user.model.js");
const { signToken } = await import("../src/utils/jwt.js");
const bcrypt = await import("bcryptjs");

describe("POST /login (controller)", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("logs in user successfully", async () => {
        const mockUser = {
            id: "123",
            email: "lotemk@gmail.com",
            password: "hashed_password",
            verificationStatus: "ACTIVE",
        };
        User.findOne.mockResolvedValue(null);
        bcrypt.default.hash.mockResolvedValue("hashed");
        signToken.mockReturnValue("mocked_jwt");

        const req = {
            body: {
                email: "lotemk@gmail.com",
                password: "Lotem123",
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        // Act
        await authController.login(req, res);

        // Assert
        expect(User.findOne).toHaveBeenCalledWith({ email: "lotemk@gmail.com" });
        expect(bcrypt.compare).toHaveBeenCalledWith("Lotem123", "hashed_password");
        expect(signToken).toHaveBeenCalledWith(mockUser);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: true,
                data: { jwt: "mocked_jwt", balance: undefined }, // אם אין balance במ mockUser
            })
        );
    });

    it("returns 401 if user not found", async () => {
        User.findOne.mockResolvedValue(null);

        const req = { body: { email: "unknown@mail.com", password: "123" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };

        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "User name is not found" });
    });

    it("returns 403 if user not verified", async () => {
        User.findOne.mockResolvedValue({ ...mockUser, verificationStatus: "PENDING" });

        const req = { body: { email: "lotemk@gmail.com", password: "123" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };

        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: "User not verified" });
    });

    it("returns 401 if password invalid", async () => {
        User.findOne.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(false);

        const req = { body: { email: "lotemk@gmail.com", password: "wrongpass" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };

        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "User name is not found" });
    });
});