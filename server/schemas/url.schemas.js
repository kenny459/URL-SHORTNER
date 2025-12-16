import z from 'zod'; 
  
export const createUrlSchema = z.object({ 
    long_url: z 
        .string() 
        .url() 
        .startsWith("https")
});