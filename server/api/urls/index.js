import { Redis } from '@upstash/redis';
import prisma from '../../server/config/prisma.js';
import { encodeId } from '../../server/utils/base62.js';
import { BASE_URL } from '../../server/config/env.js';

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
let upstash;
if (UPSTASH_URL && UPSTASH_TOKEN) {
  upstash = new Redis({ url: UPSTASH_URL, token: UPSTASH_TOKEN });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  const { long_url } = req.body ?? {};
  if (!long_url || typeof long_url !== 'string' || !/^https?:\/\//i.test(long_url)) {
    return res.status(400).json({ error: 'long_url is required and must start with http:// or https://' });
  }

  try {
    const already = await prisma.urls.findFirst({ where: { long_url } });
    if (already) {
      const shortURL = `${BASE_URL}/${already.short_code}`;
      return res.status(200).json({
        id: already.id.toString(),
        shortUrl: shortURL,
        longUrl: already.long_url,
        clickCount: already.click_count.toString(),
      });
    }

    const newURL = await prisma.$transaction(async (tx) => {
      const created = await tx.urls.create({
        data: {
          long_url,
          short_code: '',
          click_count: 0,
        },
      });

      const idNum = Number(created.id) + 10000000;
      const code = encodeId(idNum);

      return await tx.urls.update({
        where: { id: created.id },
        data: { short_code: code },
      });
    });

    const shortURL = `${BASE_URL}/${newURL.short_code}`;

    if (upstash) {
      try {
        await upstash.set(newURL.short_code, long_url);
      } catch (e) {
        console.warn('Upstash set failed:', e?.message ?? e);
      }
    }

    return res.status(201).json({
      id: newURL.id.toString(),
      shortUrl: shortURL,
      longUrl,
      clickCount: newURL.click_count.toString(),
    });
  } catch (error) {
    console.error('Serverless createUrl error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error?.message });
  }
}