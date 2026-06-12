// export function validateRegister(req, res, next) {
//     const { name, email, password } = req.body

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

//     if (!name || name.trim().length < 3) {
//         return res.status(400).send({ response: "O nome deve conter pelo menos 3 caracteres" })
//     }

//     if (!email || !emailRegex.test(email)) {
//         return res.status(400).send({ response: "Email inválido" })
//     }

//     if (!password || password.length < 6) {
//         return res.status(400).send({ response: "A senha deve ter pelo menos 6 caracteres" })
//     }

//     next()
// }


// // ---------------- PECAS ----------------

// export function validateCreatePeca(req, res, next) {
//     const {
//         nome_peca,
//         codigo_peca,
//         fornecedor,
//         quantidade,
//         preco_unitario,
//         estoque
//     } = req.body

//     if (!nome_peca || nome_peca.trim().length < 3) {
//         return res.status(400).send({ response: "Nome da peça deve ter pelo menos 3 caracteres" })
//     }

//     if (!codigo_peca || isNaN(Number(codigo_peca))) {
//         return res.status(400).send({ response: "Código da peça inválido" })
//     }

//     if (!fornecedor || fornecedor.trim() === '') {
//         return res.status(400).send({ response: "Fornecedor é obrigatório" })
//     }

//     if (!quantidade || isNaN(Number(quantidade)) || Number(quantidade) <= 0) {
//         return res.status(400).send({ response: "Quantidade deve ser maior que 0" })
//     }

//     if (!preco_unitario || isNaN(Number(preco_unitario)) || Number(preco_unitario) <= 0) {
//         return res.status(400).send({ response: "Preço unitário deve ser maior que 0" })
//     }

//     if (estoque === undefined || isNaN(Number(estoque)) || Number(estoque) < 0) {
//         return res.status(400).send({ response: "Estoque inválido" })
//     }

//     next()
// }


// // ---------------- GET BY ID ----------------

// export function validateGetPecaByid(req, res, next) {
//     const { id } = req.params

//     if (!id || isNaN(Number(id)) || Number(id) <= 0) {
//         return res.status(400).send({ response: "ID inválido" })
//     }

//     next()
// }


// // ---------------- UPDATE ----------------

// export function validateUpdatePeca(req, res, next) {
//     const { quantidade, estoque, preco_unitario } = req.body

//     if (!quantidade || isNaN(Number(quantidade)) || Number(quantidade) <= 0) {
//         return res.status(400).send({ response: "Quantidade deve ser maior que 0" })
//     }

//     if (estoque === undefined || isNaN(Number(estoque)) || Number(estoque) < 0) {
//         return res.status(400).send({ response: "Estoque inválido" })
//     }

//     if (!preco_unitario || isNaN(Number(preco_unitario)) || Number(preco_unitario) <= 0) {
//         return res.status(400).send({ response: "Preço unitário deve ser maior que 0" })
//     }

//     next()
// }


// // ---------------- DELETE ----------------

// export function validateDeletePeca(req, res, next) {
//     const { id } = req.params

//     if (!id || isNaN(Number(id)) || Number(id) <= 0) {
//         return res.status(400).send({ response: "ID inválido" })
//     }

//     next()
// }


// // ---------------- GET ALL ----------------

// export function validateGetAllPecas(req, res, next) {
//     next()
// }