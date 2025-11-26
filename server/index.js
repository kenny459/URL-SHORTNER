// Import Express
import express from 'express'   
import { PORT } from './config/env.js'; 

import urlRouter from './routes/url.routes.js';
 
const app = express();  
  
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));


app.use('/api/v1/urls', urlRouter);    



app.get('/', (req, res) => { 
  res.send('Welcome to the Url Shortening API!'); 
}); 
   
app.listen(PORT, () => { 
  console.log(`Server is running on http://localhost:${PORT}`);  
});