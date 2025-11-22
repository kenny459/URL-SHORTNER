import  { Router  } from "express";  
import { createUrl } from "../controllers/urlControllers.js";

const urlRouter = Router();  

urlRouter.post('/', createUrl );
 


export default urlRouter;