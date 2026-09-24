const express = require("express")
const cors = require("cors")
const ocorrencias = require("./dados.json")

function autoIncrement() {
    return Number(ocorrencias[ocorrencias.length - 1].id) + 1
}

const rotaInicial = (req, res) => {
    res.json("Back-end respondendo")
}

const createOcorrencia = (req, res) => {
    const ocorrencia = req.body

    ocorrencia.id = autoIncrement()

    ocorrencias.push(ocorrencia)

    res.status(201).json(ocorrencia)
}

const readOcorrencia = (req, res) => {
    res.json(ocorrencias)
}

const buscaOcorrencia = (req, res) => {
    const ocorrencia = ocorrencias.find(
        o => o.id == Number(req.params.id)
    )

    if (ocorrencia) {
        res.json(ocorrencia)
    } else {
        res.status(404).json("Id não encontrado")
    }
}

const buscaPorLocal = (req, res) => {
    const local = req.params.local

    const resultado = ocorrencias.filter(
        o => o.local.toLowerCase().includes(local.toLowerCase())
    )

    res.json(resultado)
}

const buscaPorTipo = (req, res) => {
    const tipo = req.params.tipo

    const resultado = ocorrencias.filter(
        o => o.tipo_residuo.toLowerCase().includes(tipo.toLowerCase())
    )

    res.json(resultado)
}

const updateOcorrencia = (req, res) => {
    const id = req.params.id
    const dados = req.body

    dados.id = Number(id)

    let status = 0

    ocorrencias.forEach((ocorrencia, indice) => {

        if (ocorrencia.id == id) {
            ocorrencias[indice] = dados
            status = 1
        }

    })

    if (status == 1) {
        res.status(202).json(dados)
    } else {
        res.status(404).send("Ocorrência não encontrada")
    }
}

const deleteOcorrencia = (req, res) => {
    const id = req.params.id

    let status = 0

    ocorrencias.forEach((ocorrencia, indice) => {

        if (ocorrencia.id == id) {
            ocorrencias.splice(indice, 1)
            status = 1
        }

    })

    if (status == 1) {
        res.json("Ocorrência excluída com sucesso")
    } else {
        res.status(404).send("Ocorrência não encontrada")
    }
}

const app = express()

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const porta = 3000

app.get("/", rotaInicial)

app.post("/ocorrencias", createOcorrencia)

app.get("/ocorrencias", readOcorrencia)

app.get("/ocorrencias/:id", buscaOcorrencia)

app.get("/ocorrencias/local/:local", buscaPorLocal)

app.get("/ocorrencias/tipo/:tipo", buscaPorTipo)

app.put("/ocorrencias/:id", updateOcorrencia)

app.delete("/ocorrencias/:id", deleteOcorrencia)

app.listen(porta, () => {
    console.log(`Servidor respondendo em: http://localhost:${porta}`)
})