import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()

export const connectionComercial = mysql.createConnection({
    host: process.env.HOST || 'localhost',
    user: process.env.USER || 'root',
    password: process.env.PASSWORD || 'root',
    database: process.env.DATABASE || 'comercial',
    port: process.env.PORT || 3306
})

export const connectionLogin = mysql.createConnection({
    host: process.env.HOST || 'localhost',
    user: process.env.USER || 'root',
    password: process.env.PASSWORD || 'root',
    database: process.env.DATABASE2 || 'db_login',
    port: process.env.PORT || 3306
})