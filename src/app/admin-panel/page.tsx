"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Register from "../register/page";
import Login from "@/components/Login/Login";

export default function AdminPanel() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    const handleLogin = () => {
        if (login === "admin" && password === "123") {
            setIsAuthenticated(true);
        } else {
            router.push("/login");
        }
    };

    if (isAuthenticated) {
        return <Login userType={"admin"} />;
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Authorization</h1>
            <input
                type="text"
                placeholder="Username"
                className="border p-2 rounded mb-2"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                className="border p-2 rounded mb-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                onClick={handleLogin}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Sign In
            </button>
        </div>
    );
}
