import express from 'express'
import login from './login.js'
import produto from './produto.js'
import dashboard from './dashboard.js'
import registro from './registro.js'
import pedidos from './pedidos.js' // 1. Importe o novo arquivo aqui

export default function initRoutes(app) {
  app
    .use(express.json())
    .use('/', login)
    .use('/', produto)
    .use('/', dashboard)
    .use('/', registro)
    .use('/', pedidos) // 2. Adicione a ativação dele aqui
}