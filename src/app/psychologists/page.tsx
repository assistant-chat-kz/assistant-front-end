'use client';

import NotFound from "@/components/NotFound/NotFound";
import { getUserId } from "../hooks/getUserId";
import { useAdmin } from "../hooks/useAdmin";
import { useUser } from "../hooks/useUser";

export default function Psychologists() {

    const { data: admin } = useAdmin(getUserId())

    console.log(admin)

    return (
        <div>psy</div>
    )
}