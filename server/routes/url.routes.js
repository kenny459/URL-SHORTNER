import  { Router  } from "express";   
import prisma from "../config/prisma.js";
import { createUrl } from "../controllers/urlControllers.js";

const router = Router();   


router.post('/', createUrl ); 
 
router.get('/:code', async (req, res ) => {  

const {code} = req.params; 

  // 1. Find the code in the Database
  const urlRecord = await prisma.urls.findUnique({
    where: { short_code: code }
  });

  // 2. If not found, show 404
  if (!urlRecord) {
    return res.status(404).send('Short URL not found');
  }

  // 3. OPTIONAL: Increment Click Count (Analytics)
  // We do this asynchronously so we don't slow down the user's redirect
  prisma.urls.update({
    where: { id: urlRecord.id },
    data: { click_count: { increment: 1 } }
  }).catch(err => console.error("Error updating stats", err));

  // 4. Redirect the user to the original Long URL
  return res.redirect(urlRecord.long_url);
})
 


export default router; 