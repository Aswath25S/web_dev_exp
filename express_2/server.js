import express from 'express'

const app = express();
const port = 8000;

app.use(express.static("public"))

app.get('/', (req, res) => {
    res.send(`<!doctype html><html><body>hello calvin</body></html>`)
})

app.listen(port, () => {console.log(`server started on ${port}`)})