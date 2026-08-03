import { Building2, UsersRound } from "lucide-react";
import { AudienceSource } from "@/types/users.types";

export const sourceLabels: Record<AudienceSource, string> = {
    KAZAKHTELECOM: "Казахтелеком",
    OTHER: "Другое",
};

export default function SourceBadge({
    source,
    compact = false,
}: {
    source: AudienceSource;
    compact?: boolean;
}) {
    const isTelecom = source === "KAZAKHTELECOM";
    const Icon = isTelecom ? Building2 : UsersRound;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${
                compact ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm"
            } ${
                isTelecom
                    ? "border-teal-200 bg-teal-50 text-teal-800"
                    : "border-slate-200 bg-slate-50 text-slate-700"
            }`}
        >
            <Icon className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
            {sourceLabels[source]}
        </span>
    );
}
