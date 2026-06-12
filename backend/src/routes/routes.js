import express from 'express'
import login from './login.js'
import produto from './produto.js'

export default function initRoutes(app){
    app
    .use(express.json())
    .use('/', login)
    .use('/', produto) 
}