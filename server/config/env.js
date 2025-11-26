import { config } from "dotenv";  

 
config({path: `.env.${process.env.NODE_ENV || 'development'}.local`})  
config({path: '.env'})  

export const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
 
export const {PORT, NODE_ENV} = process.env