"use client";
import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const onSubmit = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/forgotpassword", { email });
            console.log("Reset email sent", response.data);
            toast.success("Password reset link sent to your email!");
            setEmailSent(true);
        } catch (error: any) {
            console.log("Failed to send reset email", error);
            const errorMessage = error.response?.data?.error || error.message || "Failed to send reset email";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-3xl mb-4">{loading ? "Processing..." : "Forgot Password"}</h1>
           

            {!emailSent ? (
                <>
                   
                    
                    <label htmlFor="email" className="mb-2">Email</label>
                    <input
                        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black w-80"
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />

                    <button
                        onClick={onSubmit}
                        disabled={!email || loading}
                        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 disabled:opacity-50 w-80"
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>

                    <Link href="/login" className="text-blue-500 hover:underline">
                        Back to Login
                    </Link>
                </>
            ) : (
                <div className="text-center">
                    <p className="text-green-600 mb-4">
                        ✓ Password reset link has been sent to your email!
                    </p>
                    <p className="mb-4">Please check your inbox and follow the instructions.</p>
                    <Link href="/login" className="text-blue-500 hover:underline">
                        Back to Login
                    </Link>
                </div>
            )}
        </div>
    );
}