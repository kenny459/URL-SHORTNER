import { config } from "dotenv";  

 
config({path: `.env.${process.env.NODE_ENV || 'development'}.local`})  
config({path: '.env'})  

export const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
 
export const {PORT, NODE_ENV} = process.env 
 
export const REDIS_URL = process.env.REDIS_URL 
export const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL
export const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN