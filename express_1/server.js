import express from 'express';
import { apiRouter } from './routes/apiRoutes.js';
import cors from 'cors';

const PORT = 8000;
const app = express();

app.use(cors())

app.get('/', (req, res) => {res.send("hello random user")})

app.use('/api', apiRouter)

app.use((req, res) => {
    res.status(404).json({message : "Endpoint not found. Please check the API documentation."})
})

app.listen(PORT, () => {console.log(`server connected on port ${PORT}`)})


/*
Challenge:
1. When a user hits the /api endpoint with query params, filter the data so 
we only serve objects that meet their requirements. 
     
The user can filter by the following properties:
  industry, country, continent, is_seeking_funding, has_mvp

Test Cases

 /api?industry=renewable%20energy&country=germany&has_mvp=true
  Should get the "GreenGrid Energy" object.

/api?industry=renewable%20energy&country=germany&has_mvp=false
  Should not get any object

/api?continent=asia&is_seeking_funding=true&has_mvp=true
  should get for objects with IDs 3, 22, 26, 29
*/