"use client";

import { useForm } from "react-hook-form";
import { axiosClassic } from "@/api/interceptors";

export default function Register() {
	const onSubmit = async (data: any) => {
		try {
			const response = await axiosClassic.post("/auth/register", data);
			console.log(data);
			alert("Registration successful");
		} catch (error) {
			console.error(error.response?.data?.message || "Registration failed");
		}
	};

	return (
		<>
			<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
						Регистрация
					</h2>
				</div>

				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
					<form action="#" method="POST" className="space-y-6">
						<div>
							<div className="flex gap-10">
								<div>
									<label
										htmlFor="name"
										className="block text-sm/6 font-medium text-gray-900"
									>
										Имя
									</label>
									<div className="mt-2">
										<input
											id="name"
											name="name"
											type="name"
											required
											autoComplete="name"
											className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
										/>
									</div>
								</div>
								<div>
									<label
										htmlFor="name"
										className="block text-sm/6 font-medium text-gray-900"
									>
										Фамилия
									</label>
									<div className="mt-2">
										<input
											id="surname"
											name="surname"
											type="surname"
											required
											autoComplete="surname"
											className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
										/>
									</div>
								</div>
							</div>
						</div>
						<div>
							<label
								htmlFor="email"
								className="block text-sm/6 font-medium text-gray-900"
							>
								Адрес электронной почты
							</label>
							<div className="mt-2">
								<input
									id="email"
									name="email"
									type="email"
									required
									autoComplete="email"
									className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
								/>
							</div>
						</div>

						<div>
							<div className="flex items-center justify-between">
								<label
									htmlFor="password"
									className="block text-sm/6 font-medium text-gray-900"
								>
									Пароль
								</label>
								{/* <div className="text-sm">
									<a
										href="#"
										className="font-semibold text-indigo-600 hover:text-indigo-500"
									>
										Forgot password?
									</a>
								</div> */}
							</div>
							<div className="mt-2">
								<input
									id="password"
									name="password"
									type="password"
									required
									autoComplete="current-password"
									className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
								/>
							</div>
						</div>

						<div>
							<button
								type="submit"
								className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							>
								Войти
							</button>
						</div>
					</form>

					<p className="mt-10 text-center text-sm/6 text-gray-500">
						Есть аккаунт?{" "}
						<a
							href="login"
							className="font-semibold text-indigo-600 hover:text-indigo-500"
						>
							Войти
						</a>
					</p>
				</div>
			</div>
		</>
	);
}
