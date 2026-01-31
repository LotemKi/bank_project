import { api } from "./apiPublic";
import type { SignupRequest, SignupResponse } from "../types/authTypes";

const signup = async (
  reqBody: SignupRequest
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await api.post<SignupResponse>("/auth/signup", reqBody);
    return { success: response.data.success };
  } catch (error: any) {
    const status = error?.response?.status;
    const msg = error?.response?.data?.error ?? "Signup failed";

    switch (status) {
      case 400:
        return { success: false, error: "Missing required fields" };
      case 409:
        return { success: false, error: "User already exists" };
      case 500:
        return { success: false, error: "Server error: failed to send verification email" };
      default:
        return { success: false, error: msg };
    }
  }
};

export default signup;
