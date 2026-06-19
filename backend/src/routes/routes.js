import express from 'express'
import login from './login.js'
import produto from './produto.js'
import dashboard from './dashboard.js'
import relatorios from './relatorios.js' 

export default function initRoutes(app){
    app
    .use(express.json())
    .use('/', login)
    .use('/', produto)
    .use('/', dashboard)
    .use('/', relatorios)
}