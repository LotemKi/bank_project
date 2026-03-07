import { jest } from "@jest/globals";

jest.unstable_mockModule("../src/db_models/user.model.js", () => ({
    default: {
        findOne: jest.fn(),
    },
}));

jest.unstable_mockModule("bcryptjs", () => ({
    default: {
        compare: jest.fn(),
    },
}));

jest.unstable_mockModule("../src/utils/jwt.js", () => ({
    signToken: jest.fn(),
}));

const authControllerModule = await import("../src/controller/auth.controller.js");
const authController = authControllerModule.default;

const { default: User } = await import("../src/db_models/user.model.js");
const { signToken } = await import("../src/utils/jwt.js");
const { default: bcrypt } = await import("bcryptjs");

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
            balance: 500
        };

        User.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue(mockUser)
        });

        bcrypt.compare.mockResolvedValue(true);
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

        await authController.login(req, res);

        expect(User.findOne).toHaveBeenCalledWith({ email: "lotemk@gmail.com" });

        expect(bcrypt.compare).toHaveBeenCalledWith(
            "Lotem123",
            "hashed_password"
        );

        expect(signToken).toHaveBeenCalledWith(mockUser);

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: {
                jwt: "mocked_jwt",
                balance: "500"
            }
        });
    });

    it("returns 401 if user not found", async () => {

        User.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue(null)
        });

        const req = {
            body: {
                email: "unknown@mail.com",
                password: "123"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };

        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
    });
});