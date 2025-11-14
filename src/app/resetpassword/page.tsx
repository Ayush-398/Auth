"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
    const router = useRouter();
    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);

    const resetPassword = async () => {
        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long!");
            return;
        }

        try {
            setLoading(true);
            await axios.post('/api/users/resetpassword', { token, password });
            setVerified(true);
            toast.success("Password reset successful!");
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (error: any) {
            setError(true);
            console.log(error.response?.data);
            const errorMessage = error.response?.data?.error || "Failed to reset password";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken || "");
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl mb-4">Reset Password</h1>
            <h2 className="p-2 bg-orange-500 text-black rounded mb-4">
                {token ? "Token Verified" : "No token"}
            </h2>

            {!verified && !error && token && (
                <div className="flex flex-col items-center">
                    <label htmlFor="password" className="mb-2">New Password</label>
                    <input
                        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black w-80"
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                    />

                    <label htmlFor="confirmPassword" className="mb-2">Confirm Password</label>
                    <input
                        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black w-80"
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                    />

                    <button
                        onClick={resetPassword}
                        disabled={loading || !password || !confirmPassword}
                        className="p-2 bg-blue-500 text-white rounded-lg w-80 disabled:opacity-50 hover:bg-blue-600"
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </div>
            )}

            {verified && (
                <div className="text-center">
                    <h2 className="text-2xl text-green-600 mb-4">✓ Password Reset Successful!</h2>
                    <p className="mb-4">Redirecting to login...</p>
                    <Link href="/login" className="text-blue-500 hover:underline">
                        Go to Login
                    </Link>
                </div>
            )}

            {error && (
                <div className="text-center">
                    <h2 className="text-2xl bg-red-500 text-white p-4 rounded mb-4">
                        Error: Invalid or expired token
                    </h2>
                    <Link href="/forgotpassword" className="text-blue-500 hover:underline">
                        Request New Reset Link
                    </Link>
                </div>
            )}

            {!token && (
                <div className="text-center">
                    <p className="text-red-500 mb-4">No reset token found</p>
                    <Link href="/forgotpassword" className="text-blue-500 hover:underline">
                        Request Reset Link
                    </Link>
                </div>
            )}
        </div>
    );
}