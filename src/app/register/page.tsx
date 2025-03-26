"use client";

import { useForm } from "react-hook-form";
import { axiosClassic } from "@/api/interceptors";
import { useRouter } from "next/navigation";

interface RegisterProps {
	userType: string;
}

export default function Register({ userType }: RegisterProps) {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm();

	const router = useRouter();

	const onSubmit = async (data: any) => {

		const dataForRegister = {
			...data,
			userType: userType ? userType : undefined
		}

		try {
			const response = await axiosClassic.post("/auth/register", dataForRegister);
			alert("Registration successful");

			// userType === 'admin' || userType === 'psychologist' ? router.push("cabinet") : router.push("/chat");
			router.push('/login')
		} catch (error) {
			//@ts-ignore
			console.error(error.response?.data?.message || "Registration failed");
		}
	};

	return (
		<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-sm">
				<h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
					{userType === 'admin' ? 'Регистрация админа' : userType === 'psychologist' ? 'Регистрация психолога' : 'Регистрация'}
				</h2>
			</div>

			<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div className="flex gap-10">
						<div>
							<label className="block text-sm/6 font-medium text-gray-900">
								Имя
							</label>
							<input
								{...register("name", { required: "Введите имя" })}
								className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 focus:outline-indigo-600 sm:text-sm/6"
							/>
							{errors.name && (
								//@ts-ignore
								<p className="text-red-500 text-sm">{errors.name.message}</p>
							)}
						</div>
						<div>
							<label className="block text-sm/6 font-medium text-gray-900">
								Фамилия
							</label>
							<input
								{...register("surname", { required: "Введите фамилию" })}
								className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 focus:outline-indigo-600 sm:text-sm/6"
							/>
							{errors.surname && (
								//@ts-ignore
								<p className="text-red-500 text-sm">{errors.surname.message}</p>
							)}
						</div>
					</div>

					<div>
						<label className="block text-sm/6 font-medium text-gray-900">
							Адрес электронной почты
						</label>
						<input
							{...register("email", {
								required: "Введите email",
								pattern: {
									value: /.+@.+\..+/,
									message: "Некорректный email",
								},
							})}
							className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 focus:outline-indigo-600 sm:text-sm/6"
						/>
						{errors.email && (
							//@ts-ignore
							<p className="text-red-500 text-sm">{errors.email.message}</p>
						)}
					</div>

					<div>
						<label className="block text-sm/6 font-medium text-gray-900">
							Пароль
						</label>
						<input
							{...register("password", {
								required: "Введите пароль",
								minLength: {
									value: 6,
									message: "Минимум 6 символов",
								},
							})}
							type="password"
							className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 focus:outline-indigo-600 sm:text-sm/6"
						/>
						{errors.password && (
							//@ts-ignore
							<p className="text-red-500 text-sm">{errors.password.message}</p>
						)}
					</div>

					<div>
						<label className="block text-sm/6 font-medium text-gray-900">
							Повторите пароль
						</label>
						<input
							{...register("confirmPassword", {
								required: "Повторите пароль",
								validate: (value) =>
									value === watch("password") || "Пароли не совпадают",
							})}
							type="password"
							className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 focus:outline-indigo-600 sm:text-sm/6"
						/>
						{errors.confirmPassword && (
							<p className="text-red-500 text-sm">
								Пароли не совпадают
							</p>
						)}
					</div>

					<button
						type="submit"
						className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-500"
					>
						Зарегистрироваться
					</button>
				</form>

				<p className="mt-10 text-center text-sm/6 text-gray-500">
					Есть аккаунт?{" "}
					<a href="login" className="font-semibold text-indigo-600 hover:text-indigo-500">
						Войти
					</a>
				</p>
			</div>
		</div>
	);
}
