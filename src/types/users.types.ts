export interface IUserResponce {
    id: string;
    name: string;
    surname: string;
    email: string;
    createdAt: Date;
    verify: boolean
    visits: number
    source: AudienceSource
    lastSeenAt?: string | null
}

export interface IUserNoAuthResponce {
    id: string;
    visits: number
    name?: string
    source: AudienceSource
    lastSeenAt?: string | null
}

export type AudienceSource = "KAZAKHTELECOM" | "OTHER";

export interface IUserAnalyticsRow {
    id: string;
    name: string;
    surname: string;
    email: string;
    kind: "registered" | "guest";
    source: AudienceSource;
    sessions: number;
    returns: number;
    userMessages: number;
    assistantMessages: number;
    totalMessages: number;
    consultationCount: number;
    averageRating: number | null;
    lastSeenAt: string | null;
    createdAt: string | null;
}

export interface IUserAnalytics {
    summary: {
        users: number;
        kazakhtelecom: number;
        other: number;
        userMessages: number;
        returns: number;
        consultations: number;
        averageRating: number | null;
    };
    users: IUserAnalyticsRow[];
}
