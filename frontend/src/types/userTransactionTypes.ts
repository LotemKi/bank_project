export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  verificationStatus: "PENDING" | "ACTIVE" | "BLOCKED";
}

export interface Transaction {
  id: number;
  fromEmail: string;
  toEmail: string;
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
  description?: string;
  createdAt: string;
}

export interface MeResponse {
  success: boolean;
  data: {
    profile: UserProfile;
    balance: number;
  };
}

export interface TransactionsResponse {
  success: boolean;
  data: {
    transactions: Transaction[];
    total: number;
    offset: number;
    limit: number;
  };
}
