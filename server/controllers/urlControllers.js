import prisma from "../config/prisma.js";
import { encodeId } from "../utils/base62.ts"; 
import { BASE_URL } from "../config/env.js"; 
import redisClient from "../config/redis.js";


export const createUrl = async (req, res) => {
    const { long_url } = req.body ?? {};

    if (!long_url) {
        return res.status(400).json({ error: 'long_url is required in request body' });
    }  
// Idempotency: Check if long_url already exists
     const alreadyExists = await prisma.urls.findFirst({
        where: { long_url }
     });

     if (alreadyExists) {
        const shortURL = `${BASE_URL}/${alreadyExists.short_code}`;
        return res.status(200).json({id: alreadyExists.id.toString(), shortUrl: shortURL, longUrl: alreadyExists.long_url, clickCount: alreadyExists.click_count.toString() });
     }

    try {
        // Ensure model accessor matches Prisma schema: schema defines model `urls` (plural)
        const newURL = await prisma.$transaction(async (tx) => {
            const created = await tx.urls.create({
                data: { 
                    id: BigInt(0),
                    long_url,
                    short_code: '' ,  
                    click_count: 0
                    

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
        const shortURL = `${BASE_URL}/${newURL.short_code}`;  
        await  redisClient.set(newURL.short_code, long_url)

        return res.status(201).json({ id: newURL.id.toString(), shortUrl: shortURL , longUrl: long_url , clickCount: newURL.click_count.toString() }); 

    } catch (error) {
        console.error('Error creating URL:', error);
        return res.status(500).json({ error: 'Internal Server Error', details: error?.message });
    }
}; 
 
