import { Router } from "express";    
import redisClient from "../config/redis.js";
import prisma from "../config/prisma.js";
import { createUrl } from "../controllers/urlControllers.js"; 
import { validate } from "../middlewares/validateurls.js"; 
import { createUrlSchema } from "../schemas/url.schemas.js";
import { broadcast, addClient, removeClient } from "../utils/sseManager.js";
const router = Router();   

router.post('/', validate(createUrlSchema), createUrl); 
 


router.get('/:code', async (req, res) => {  
  const { code } = req.params;
  
  try {
    // Always increment click count and retrieve long_url
    let longUrl;
    try {
      const updateResult = await prisma.urls.update({
        where: { short_code: code },
        data: { click_count: { increment: 1 } },
        select: { long_url: true }
      });  
       
      const clickCount = Number(updateResult.click_count.toString());
console.log('Broadcasting:', code, clickCount);
broadcast(code, clickCount);

       
     

      longUrl = updateResult.long_url;
    } catch (error) {
      if (error.code === 'P2025') {  // Record not found
        return res.status(404).send('Short URL not found');
      }
      throw error;
    }
    
    // Check Redis cache
    const cachedUrl = await redisClient.get(code);
    
    if (cachedUrl) {
      console.log("Cache Hit");
      return res.redirect(cachedUrl);
    }
    
    console.log('Cache Miss');
    
    // Cache the URL
    await redisClient.set(code, longUrl);
    
    // Redirect
    return res.redirect(longUrl);
    
  } catch (error) {
    console.error('Error in redirect route:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});
 
router.get('/:code/live', (req, res) => {
  const { code } = req.params;

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send initial connection confirmation
  res.write(`data: ${JSON.stringify({ connected: true })}\n\n`);

  // Register this client
  addClient(code, res);

  // Clean up when client disconnects
  req.on('close', () => {
    removeClient(code, res);
  });
});

export default router;