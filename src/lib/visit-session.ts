const VISIT_SESSION_KEY = "aikouchVisitSession";
const VISIT_SESSION_TTL = 30 * 60 * 1000;

interface StoredVisitSession {
    id: string;
    lastActivityAt: number;
}

export function getVisitSessionId(): string {
    const now = Date.now();
    const storedValue = localStorage.getItem(VISIT_SESSION_KEY);

    if (storedValue) {
        try {
            const stored = JSON.parse(storedValue) as StoredVisitSession;
            if (stored.id && now - stored.lastActivityAt < VISIT_SESSION_TTL) {
                localStorage.setItem(
                    VISIT_SESSION_KEY,
                    JSON.stringify({ ...stored, lastActivityAt: now }),
                );
                return stored.id;
            }
        } catch {
            localStorage.removeItem(VISIT_SESSION_KEY);
        }
    }

    const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${now}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(
        VISIT_SESSION_KEY,
        JSON.stringify({ id, lastActivityAt: now }),
    );
    return id;
}
