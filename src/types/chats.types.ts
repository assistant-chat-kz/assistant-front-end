export interface IChatResponce {
    chatId: string;
    members: string[];
    messages: any[]
    call: boolean
    psy?: string
}