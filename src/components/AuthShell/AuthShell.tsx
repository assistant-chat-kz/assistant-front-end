import Link from "next/link";
import { HeartHandshake, LockKeyhole, MessageCircleHeart } from "lucide-react";
import { ReactNode } from "react";

export default function AuthShell({
    title,
    description,
    children,
}: {
    title: string;
    description: string;
    children: ReactNode;
}) {
    return (
        <main className="min-h-dvh px-4 py-5 sm:px-6 lg:p-8">
            <div className="mx-auto grid min-h-[calc(100dvh-2.5rem)] max-w-6xl overflow-hidden rounded-[2rem] surface-card lg:grid-cols-[1.04fr_0.96fr]">
                <section className="relative hidden overflow-hidden bg-[#123d38] p-12 text-white lg:flex lg:flex-col lg:justify-between">
                    <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10 bg-white/5" />
                    <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full border border-white/10 bg-[#f9735b]/10" />

                    <Link href="/" className="relative inline-flex items-center gap-3 text-lg font-semibold">
                        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/12">
                            <HeartHandshake className="h-6 w-6" />
                        </span>
                        Aikouch
                    </Link>

                    <div className="relative max-w-md">
                        <p className="mb-4 text-sm font-medium uppercase tracking-[0.22em] text-teal-200">
                            Поддержка без лишнего шума
                        </p>
                        <h1 className="text-4xl font-semibold leading-tight">
                            Спокойное пространство, где можно быть собой
                        </h1>
                        <p className="mt-5 text-base leading-7 text-white/70">
                            Напишите, что происходит. Aikouch поможет разложить мысли по полочкам и найти следующий небольшой шаг.
                        </p>
                    </div>

                    <div className="relative grid gap-3 text-sm text-white/78">
                        <p className="flex items-center gap-3"><LockKeyhole className="h-4 w-4 text-teal-200" /> Бережный и приватный диалог</p>
                        <p className="flex items-center gap-3"><MessageCircleHeart className="h-4 w-4 text-teal-200" /> Поддержка доступна в любое время</p>
                    </div>
                </section>

                <section className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
                    <div className="w-full max-w-md">
                        <Link href="/" className="mb-10 inline-flex items-center gap-2 font-semibold text-teal-800 lg:hidden">
                            <HeartHandshake className="h-6 w-6" /> Aikouch
                        </Link>
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Добро пожаловать</p>
                        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{title}</h2>
                        <p className="mt-3 leading-6 text-slate-500">{description}</p>
                        <div className="mt-8">{children}</div>
                    </div>
                </section>
            </div>
        </main>
    );
}
