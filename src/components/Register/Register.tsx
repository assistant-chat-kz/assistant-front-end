"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { axiosClassic } from "@/api/interceptors";
import AuthShell from "../AuthShell/AuthShell";
import SourceBadge from "../SourceBadge/SourceBadge";

interface RegisterProps {
    userType: "user" | "admin" | "psychologist";
}

interface RegisterForm {
    name: string;
    surname: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export default function Register({ userType }: RegisterProps) {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterForm>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();
    const email = watch("email", "");

    const source = useMemo(
        () => email.trim().toLowerCase().endsWith("@telecom.kz") ? "KAZAKHTELECOM" : "OTHER",
        [email],
    );

    const onSubmit = async ({ confirmPassword: _confirmPassword, ...data }: RegisterForm) => {
        setIsSubmitting(true);
        setErrorMessage("");

        try {
            await axiosClassic.post("/auth/register", { ...data, userType });
            router.push(userType === "user" ? "/login?registered=1" : "/admin-panel");
        } catch (error: any) {
            setErrorMessage(
                error.response?.data?.message || "Не удалось создать аккаунт. Возможно, эта почта уже используется.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const title =
        userType === "admin"
            ? "Новый администратор"
            : userType === "psychologist"
                ? "Новый психолог"
                : "Создайте аккаунт";

    return (
        <AuthShell title={title} description="Пара минут — и можно начинать разговор.">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Имя</label>
                        <input
                            {...register("name", { required: "Укажите имя" })}
                            className="field-control"
                            autoComplete="given-name"
                            placeholder="Имя"
                        />
                        {errors.name && <p className="mt-2 text-sm text-rose-600">{errors.name.message}</p>}
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Фамилия</label>
                        <input
                            {...register("surname", { required: "Укажите фамилию" })}
                            className="field-control"
                            autoComplete="family-name"
                            placeholder="Фамилия"
                        />
                        {errors.surname && <p className="mt-2 text-sm text-rose-600">{errors.surname.message}</p>}
                    </div>
                </div>

                <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                        <label className="block text-sm font-medium text-slate-700">Электронная почта</label>
                        {email.includes("@") && <SourceBadge source={source} compact />}
                    </div>
                    <input
                        {...register("email", {
                            required: "Укажите почту",
                            pattern: { value: /.+@.+\..+/, message: "Проверьте адрес почты" },
                        })}
                        type="email"
                        className="field-control"
                        autoComplete="email"
                        placeholder="name@example.kz"
                    />
                    {errors.email && <p className="mt-2 text-sm text-rose-600">{errors.email.message}</p>}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Пароль</label>
                    <input
                        {...register("password", {
                            required: "Введите пароль",
                            minLength: { value: 6, message: "Минимум 6 символов" },
                        })}
                        type="password"
                        className="field-control"
                        autoComplete="new-password"
                        placeholder="Не меньше 6 символов"
                    />
                    {errors.password && <p className="mt-2 text-sm text-rose-600">{errors.password.message}</p>}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Повторите пароль</label>
                    <input
                        {...register("confirmPassword", {
                            required: "Повторите пароль",
                            validate: (value) => value === watch("password") || "Пароли не совпадают",
                        })}
                        type="password"
                        className="field-control"
                        autoComplete="new-password"
                        placeholder="Повторите пароль"
                    />
                    {errors.confirmPassword && <p className="mt-2 text-sm text-rose-600">{errors.confirmPassword.message}</p>}
                </div>

                {errorMessage && (
                    <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {errorMessage}
                    </div>
                )}

                <button type="submit" disabled={isSubmitting} className="primary-button h-12 w-full gap-2 disabled:cursor-wait disabled:opacity-70">
                    {isSubmitting ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <>Создать аккаунт <ArrowRight className="h-4 w-4" /></>}
                </button>
            </form>

            {userType === "user" && (
                <p className="mt-7 text-center text-sm text-slate-500">
                    Уже есть аккаунт?{" "}
                    <Link href="/login" className="font-semibold text-teal-700 hover:text-teal-900">
                        Войти
                    </Link>
                </p>
            )}
        </AuthShell>
    );
}
