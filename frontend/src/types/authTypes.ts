export interface LoginRequest {
  email: string;
  password: string;
};

export interface LoginSuccess {
  success: boolean;
  data: {
    jwt: string;
    balance: string;
  };
};

export interface LoginFailure {
  success: false;
  data: "INVALID_CREDENTIALS" | "SERVER_ERROR" | "NETWORK_ERROR";
};

export type LoginResponse = LoginSuccess | LoginFailure;

export interface SignupRequest {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  success: boolean;
  message?: string;
  token?: string; 
}