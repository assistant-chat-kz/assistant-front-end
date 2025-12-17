"use client"

import { useForm } from "react-hook-form";
import { axiosClassic } from "@/api/interceptors";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

import { jwtDecode } from "jwt-decode";
import Modal from "../Modal/Modal";
import AssistantChoice from "../AssistantChoice/AssistantChoice";
import { useEffect, useState } from "react";

interface ILogin {
    userType: string
}

export default function Login({ userType }: ILogin) {
    const { register, handleSubmit } = useForm();

    const [openModal, setOpenModal] = useState(false)

    const router = useRouter();

    const pathname = usePathname()

    useEffect(() => {
        if (typeof window !== "undefined") {
            const theme = localStorage.getItem("theme");
            if (theme === "dark") {
                localStorage.setItem("theme", "light");
                document.body.classList.remove("dark");
                document.body.classList.add("light");
            }
        }
    }, []);


    const onSubmit = async (data: any) => {
        try {
            let response;
            let userTypeData;

            try {
                response = await (userType === "admin"
                    ? axiosClassic.post("/auth/loginAdmin", data)
                    : axiosClassic.post("/auth/login", data));
            } catch (error: any) {
                console.error("Ошибка при входе, пробуем /auth/loginPsychologist", error.response?.data?.message);

                response = await axiosClassic.post("/auth/loginPsychologist", data);

                userTypeData = 'psychologist'
            }

            const token = response.data.accessToken;
            if (!token) throw new Error("Нет accessToken в ответе сервера");

            localStorage.setItem("accessToken", token);
            const decoded: any = jwtDecode(token);
            localStorage.setItem("userId", decoded.userId);

            alert("Login successful");

            if (userType === "admin") {
                router.push('cabinet')
            } else if (userTypeData === "psychologist") {
                router.push("/cabinet");
            } else {
                setOpenModal(true)
            }
        } catch (error: any) {
            console.error(error.response?.data?.message || "Login failed");
            alert(error.response?.data?.message || "Ошибка входа");
        }

    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <AssistantChoice
                openModal={openModal}
                setOpenModal={setOpenModal}
            />
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
                    {userType === "admin"
                        ? "Sign in as admin"
                        : userType === "psychologist"
                            ? "Sign in as psychologist"
                            : "Sign in"}
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-900"
                        >
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                {...register("email")}
                                id="email"
                                type="email"
                                required
                                autoComplete="email"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-900"
                        >
                            Password
                        </label>
                        <div className="mt-2">
                            <input
                                {...register("password")}
                                id="password"
                                type="password"
                                required
                                autoComplete="current-password"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-indigo-600"
                        >
                            Sign in
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Don't have an account?{" "}
                    <a
                        href={pathname === '/admin-panel' ? '/admin-panel/register' : 'register'}
                        className="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                        Register
                    </a>
                </p>
            </div>
        </div>
    );

}
