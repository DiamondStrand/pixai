import type { NextApiRequest, NextApiResponse } from 'next';
import { generateSearchTerm } from '../../services/openAIService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { description } = req.body;

    try {
        const suggestedQuery = await generateSearchTerm(description);
        res.status(200).json(suggestedQuery);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate search term' });
    }
}