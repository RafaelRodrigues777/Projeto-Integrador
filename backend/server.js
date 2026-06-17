import express from 'express'
import initRoutes from './src/routes/routes.js'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
const port = 8080

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors({ origin: '*' }))
app.use(express.static(path.join(__dirname, '..', 'Frontend')))

// sobe uma pasta do backend e entra no Frontend/Interno
app.use(express.static(path.join(__dirname, '..', 'Frontend', 'Interno')))

initRoutes(app)

app.get('/', (req, res) => {
    return res.send("A API está rodando")
})

app.listen(port, () => {
    console.log("O servidor está rodando em http://localhost:8080")    
})