import { api } from "./apiPublic";
import type { LoginRequest, LoginResponse } from "../types/authTypes";
import axios from "axios";

const login = async (reqbody: LoginRequest):Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>("/auth/login", reqbody);
    return response.data;
  }
  catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;

      if (status === 401) {
        return { success: false, data: "INVALID_CREDENTIALS" };
      }

      if (status && status >= 500) {
        return { success: false, data: "SERVER_ERROR" };
      }
    }

    return { success: false, data: "NETWORK_ERROR" };
  }
};


export default login;
