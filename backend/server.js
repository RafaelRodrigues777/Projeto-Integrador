import express from 'express'
import initRoutes from './src/routes/routes.js'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
const port = 8080

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ==========================================
// MIDDLEWARES (Devem vir ANTES das rotas!)
// ==========================================
app.use(cors({ origin: '*' }))

// LINHA ESSENCIAL QUE FALTAVA: Permite que o Express leia dados enviados via JSON e URL
app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))

// Arquivos Estáticos do Frontend
app.use(express.static(path.join(__dirname, '..', 'Frontend')))
app.use(express.static(path.join(__dirname, '..', 'Frontend', 'Interno')))

// ==========================================
// INICIALIZAÇÃO DAS ROTAS
// ==========================================
initRoutes(app)

app.get('/', (req, res) => {
    return res.send("A API está rodando")
})

app.listen(port, () => {
    console.log("O servidor está rodando em http://localhost:8080")    
})