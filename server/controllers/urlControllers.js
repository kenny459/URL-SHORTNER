import prisma from "../config/prisma.js";
import { encodeId } from "../utils/base62.ts";

export const createUrl = async (req, res) => {
    const { long_url } = req.body ?? {};

    if (!long_url) {
        return res.status(400).json({ error: 'long_url is required in request body' });
    }

    try {
        // Ensure model accessor matches Prisma schema: schema defines model `urls` (plural)
        const newURL = await prisma.$transaction(async (tx) => {
            const created = await tx.urls.create({
                data: {
                    long_url,
                    short_code: ''
                }
            });

            // Prisma `BigInt` id must be explicitly converted before mixing with Number
            const idNum = Number(created.id) + 10000000;
            const code = encodeId(idNum);

            return await tx.urls.update({
                where: { id: created.id },
                data: { short_code: code }
            });
        });

        return res.status(201).json({ short_code: `${newURL.short_code}` });
    } catch (error) {
        console.error('Error creating URL:', error);
        return res.status(500).json({ error: 'Internal Server Error', details: error?.message });
    }
};