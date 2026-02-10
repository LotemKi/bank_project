import React, { createContext, useContext, useEffect, useState } from "react";
import type { UserProfile } from "../types/userTransactionTypes";
import { apiPrivate } from "../api/apiPrivate";
import Cookies from "js-cookie";
import { initSocket } from "../sockets/chat.ts";

type AuthContextType = {
    profile: UserProfile | null;
    balance: number | null;
    loading: boolean;
    refreshProfile: () => Promise<void>;
    setProfile: (p: UserProfile | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [balance, setBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshProfile = async () => {
        setLoading(true);
        try {
            const res = await apiPrivate.get("/me");
            setProfile(res.data.data.profile);
            setBalance(res.data.data.balance);
        } catch (err: any) {
            // If unauthorized, clear token
            if (err.response?.status === 401) {
                Cookies.remove("access_token");
                setProfile(null);
                setBalance(null);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshProfile();
    }, []);

    useEffect(() => {
        if (profile?.id) {
            initSocket(profile.id);
        }
    }, [profile?.id]);

    return (
        <AuthContext.Provider value={{ profile, balance, loading, refreshProfile, setProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
    return ctx;
};

export default AuthProvider;
