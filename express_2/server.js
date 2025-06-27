import express from 'express'
import { productsRouter } from './routes/products.js';

const app = express();
const port = 8000;

app.use(express.static("public"))
app.use('/api/products', productsRouter)

app.listen(port, () => {console.log(`server started on ${port}`)}).
    on('error', (error) => {
        console.log("failed to start server : ", error)
    })