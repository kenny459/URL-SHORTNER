import { ZodError } from "zod";

// This function wraps the Zod check in a standard Express Middleware format
export const validate = (schema) => 
  async (req, res, next) => {
    try {
      // 1. Try to parse the Body/Query/Params
      await schema.parseAsync(
         req.body
     
      );

      // 2. If successful, move to the NEXT function (The Controller)
      return next(); 
    } catch (error) {
      // 3. If failed, stop here. Do NOT call next().
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: error.errors 
        });
      }
      return res.status(400).json({ error: "Invalid request" });
    }
  };