import type { NextApiRequest, NextApiResponse } from "next";
import { axiosClassic } from "./interceptors";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Метод не разрешен' });
    }

    const { prompt } = req.body;

    const response = await fetch('http://localhost:4200/api/yandex-gpt/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'applocation/json' },
        body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    res.status(200).json(data)
}