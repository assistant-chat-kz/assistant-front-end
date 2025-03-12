"use client";

import { useUser } from "../hooks/useUser";

export default function Cabinet() {


    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") ?? undefined : undefined;

    const { data: user, isLoading, error } = useUser(userId)

    console.log(userId)

    return (
        <div>cabinet</div>
    )
}