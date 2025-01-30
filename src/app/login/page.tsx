"use client";

import { useForm } from "react-hook-form";
import { axiosClassic } from "@/api/interceptors";
import { useRouter } from "next/navigation";

export default function Login() {
	const { register, handleSubmit } = useForm();
	const router = useRouter();

	const onSubmit = async (data: any) => {
		try {
			const response = await axiosClassic.post("/auth/login", data);
			const token = response.data.accessToken;

			if (!token) throw new Error("Нет accessToken в ответе сервера");

			localStorage.setItem("accessToken", token);

			alert("Login successful");

			router.push("/");
		} catch (error: any) {
			console.error(error.response?.data?.message || "Login failed");
			alert(error.response?.data?.message || "Ошибка входа");
		}
	};

	return (
		<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-sm">
				<h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
					Вход
				</h2>
			</div>

			<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-900"
						>
							Адрес электронной почты
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
							Пароль
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
							Войти
						</button>
					</div>
				</form>

				<p className="mt-10 text-center text-sm text-gray-500">
					Нет аккаунта?{" "}
					<a
						href="register"
						className="font-semibold text-indigo-600 hover:text-indigo-500"
					>
						Регистрация
					</a>
				</p>
			</div>
		</div>
	);
}
