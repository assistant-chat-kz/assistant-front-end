"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, LoaderCircle, Mail } from "lucide-react";
import { axiosClassic } from "@/api/interceptors";
import { AudienceSource } from "@/types/users.types";
import AssistantChoice from "../AssistantChoice/AssistantChoice";
import AuthShell from "../AuthShell/AuthShell";

type LoginUserType = "user" | "admin" | "psychologist";

interface LoginProps {
    userType: LoginUserType;
}

interface LoginForm {
    email: string;
    password: string;
}

interface TokenPayload {
    userId: string;
    userType?: string;
    source?: AudienceSource;
}

export default function Login({ userType }: LoginProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>();
    const [openModal, setOpenModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    useEffect(() => {
        localStorage.setItem("theme", "light");
        document.body.classList.remove("dark");
    }, []);

    const loginAt = async (endpoint: string, data: LoginForm) =>
        axiosClassic.post(endpoint, data);

    const onSubmit = async (data: LoginForm) => {
        setIsSubmitting(true);
        setErrorMessage("");

        try {
            let response;
            let resolvedType: LoginUserType = userType;

            if (userType === "admin") {
                response = await loginAt("/auth/loginAdmin", data);
            } else if (userType === "psychologist") {
                response = await loginAt("/auth/loginPsychologist", data);
            } else {
                try {
                    response = await loginAt("/auth/login", data);
                } catch {
                    response = await loginAt("/auth/loginPsychologist", data);
                    resolvedType = "psychologist";
                }
            }

            const token = response.data.accessToken;
            if (!token) throw new Error("Сервер не вернул токен доступа");

            const decoded = jwtDecode<TokenPayload>(token);
            const source = response.data.source || decoded.source || "OTHER";
            localStorage.setItem("accessToken", token);
            localStorage.setItem("userId", decoded.userId);
            localStorage.setItem("userSource", source);

            if (resolvedType === "admin" || resolvedType === "psychologist") {
                router.push("/cabinet");
                return;
            }

            sessionStorage.setItem("showSourceBanner", "true");
            setOpenModal(true);
        } catch (error: any) {
            setErrorMessage(
                error.response?.data?.message === "Invalid credentials"
                    ? "Неверная почта или пароль"
                    : error.response?.data?.message || "Не удалось войти. Попробуйте ещё раз.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const title =
        userType === "admin"
            ? "Вход для администратора"
            : userType === "psychologist"
                ? "Вход для психолога"
                : "Войдите в свой аккаунт";

    return (
        <AuthShell title={title} description="Продолжите диалог или начните новую беседу в спокойном темпе.">
            <AssistantChoice openModal={openModal} setOpenModal={setOpenModal} />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                        Электронная почта
                    </label>
                    <div className="relative">
                        {/* <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /> */}
                        <input
                            {...register("email", {
                                required: "Укажите почту",
                                pattern: { value: /.+@.+\..+/, message: "Проверьте адрес почты" },
                            })}
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder="name@example.kz"
                            className="field-control pl-10"
                        />
                    </div>
                    {errors.email && <p className="mt-2 text-sm text-rose-600">{errors.email.message}</p>}
                </div>

                <div>
                    <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
                        Пароль
                    </label>
                    <div className="relative">
                        <input
                            {...register("password", { required: "Введите пароль" })}
                            id="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            placeholder="Ваш пароль"
                            className="field-control pr-11"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((value) => !value)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    {errors.password && <p className="mt-2 text-sm text-rose-600">{errors.password.message}</p>}
                </div>

                {errorMessage && (
                    <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {errorMessage}
                    </div>
                )}

                <button type="submit" disabled={isSubmitting} className="primary-button h-12 w-full gap-2 disabled:cursor-wait disabled:opacity-70">
                    {isSubmitting ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <>Войти <ArrowRight className="h-4 w-4" /></>}
                </button>
            </form>

            {userType === "user" && (
                <p className="mt-7 text-center text-sm text-slate-500">
                    Ещё нет аккаунта?{" "}
                    <Link href="/register" className="font-semibold text-teal-700 hover:text-teal-900">
                        Зарегистрироваться
                    </Link>
                </p>
            )}
        </AuthShell>
    );
}
