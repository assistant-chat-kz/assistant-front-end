import { useForm } from "react-hook-form";
import { axiosClassic } from "@/api/interceptors";
import { useRouter } from "next/navigation";

import Modal from '@/components/Modal/Modal'
import { useState } from "react";

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

    const [openModal, setOpenModal] = useState(false)

    const router = useRouter();

    const onSubmit = async (data: any) => {

        const dataForRegister = {
            ...data,
            userType: userType ? userType : undefined
        }

        const telecomEmail = data.email.split('@')[1]

        if (telecomEmail === 'telecom.kz') {
            try {
                const response = await axiosClassic.post("/auth/register", dataForRegister);
                alert("Registration successful");
                // alert("Подождите когда вашу почту подтвердят ");

                // userType === 'admin' || userType === 'psychologist' ? router.push("cabinet") : router.push("/chat");
                // router.push('/login')
            } catch (error) {
                //@ts-ignore
                console.error(error.response?.data?.message || "Registration failed");
            }
        } else {
            setOpenModal(true)
        }
    };


    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <Modal
                title={"Error"}
                content={"Invalid email"}
                openModal={openModal}
                setOpenModal={setOpenModal}
                action={() => setOpenModal(false)}
                button="accept"
            />

            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                    {userType === "admin"
                        ? "Admin registration"
                        : userType === "psychologist"
                            ? "Psychologist registration"
                            : "Registration"}
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex gap-10">
                        <div>
                            <label className="block text-sm/6 font-medium text-gray-900">
                                First name
                            </label>
                            <input
                                {...register("name", { required: "Enter your first name" })}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 focus:outline-indigo-600 sm:text-sm/6"
                            />
                            {errors.name && (
                                //@ts-ignore
                                <p className="text-red-500 text-sm">{errors.name.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm/6 font-medium text-gray-900">
                                Last name
                            </label>
                            <input
                                {...register("surname", { required: "Enter your last name" })}
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
                            Email address
                        </label>
                        <input
                            {...register("email", {
                                required: "Enter your email",
                                pattern: {
                                    value: /.+@.+\..+/,
                                    message: "Invalid email",
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
                            Password
                        </label>
                        <input
                            {...register("password", {
                                required: "Enter your password",
                                minLength: {
                                    value: 6,
                                    message: "Minimum 6 characters",
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
                            Confirm password
                        </label>
                        <input
                            {...register("confirmPassword", {
                                required: "Confirm your password",
                                validate: (value) =>
                                    value === watch("password") || "Passwords do not match",
                            })}
                            type="password"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 focus:outline-indigo-600 sm:text-sm/6"
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm">Passwords do not match</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-500"
                    >
                        Register
                    </button>
                </form>

                <p className="mt-10 text-center text-sm/6 text-gray-500">
                    Already have an account?{" "}
                    <a
                        href="login"
                        className="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );

}
