export default function Loading() {
    return (
        <div className="flex items-end gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-teal-700 text-xs font-semibold text-white">AI</span>
            <div className="flex h-11 items-center gap-1 rounded-2xl rounded-bl-md border border-[#dce7e3] bg-white px-4 shadow-sm" aria-label="Aikouch печатает">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-500 [animation-delay:-0.2s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-500 [animation-delay:-0.1s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-500" />
            </div>
        </div>
    )
}
