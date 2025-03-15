export const getUserId = () => {
    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") ?? undefined : undefined;
    return userId
}