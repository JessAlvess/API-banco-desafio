const express = require('express')
const app = express()
const rotas = require('./rotas')

app.use(rotas)

app.listen(8000)