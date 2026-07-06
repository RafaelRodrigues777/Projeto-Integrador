const API = 'http://localhost:8080';

// Mapas de memória para checagem rápida no submit
let mapaClientes = {};
let mapaVendedores = {};
let mapaProdutos = {};
let mapaPagamentos = {};
let mapaLocalizacoes = {}; 
let mapaCategorias = {};   

document.addEventListener('DOMContentLoaded', async () => {
    const campoData = document.getElementById('data_pedido');
    if (campoData) campoData.valueAsDate = new Date();

    // Alimentando listas e mapas iniciais com proteção individual para não travar a tela
    await carregarDatalist('lista-clientes', `${API}/clientes`, 'id_cliente', 'nome_cliente', mapaClientes);
    await carregarDatalist('lista-vendedores', `${API}/vendedores`, 'id_vendedor', 'nome_vendedor', mapaVendedores);
    await carregarDatalist('lista-produtos', `${API}/produtos`, 'id_produto', 'nome_produto', mapaProdutos);
    await carregarDatalist('lista-pagamentos', `${API}/tipos-pagamento`, 'id_tipo_pagamento', 'nome_tipo', mapaPagamentos);
    
    // Rotas opcionais (se derem erro, o código não vai mais travar)
    await carregarDatalist('lista-categorias', `${API}/categorias`, 'id_categoria', 'nome_categoria', mapaCategorias);
    await carregarDatalist('lista-cidades', `${API}/localizacoes`, 'id_localizacao', item => `${item.cidade} - ${item.estado}`, mapaLocalizacoes, true);

    // Exibe Cidade/Estado de forma dinâmica se o Cliente for novo
    const inputCliente = document.getElementById('txt_cliente');
    const grupoCidade = document.getElementById('grupo-cidade-cliente');
    const grupoEstado = document.getElementById('grupo-estado-cliente');
    
    if (inputCliente) {
        inputCliente.addEventListener('input', () => {
            const valor = inputCliente.value.trim().toLowerCase();
            // Se digitou algo e esse algo NÃO existe no mapa de clientes cadastrados
            if (valor && !mapaClientes[valor]) {
                grupoCidade.style.display = 'flex';
                grupoEstado.style.display = 'flex';
                document.getElementById('txt_cidade').required = true;
                document.getElementById('txt_estado').required = true;
            } else {
                grupoCidade.style.display = 'none';
                grupoEstado.style.display = 'none';
                document.getElementById('txt_cidade').required = false;
                document.getElementById('txt_estado').required = false;
            }
        });
    }

    // Exibe Categoria/Preço de forma dinâmica se o Produto for novo
    const inputProduto = document.getElementById('txt_produto');
    const grupoCategoria = document.getElementById('grupo-categoria-produto');
    const grupoValor = document.getElementById('grupo-valor-produto');

    if (inputProduto) {
        inputProduto.addEventListener('input', () => {
            const valor = inputProduto.value.trim().toLowerCase();
            // Se digitou algo e esse algo NÃO existe no mapa de produtos cadastrados
            if (valor && !mapaProdutos[valor]) {
                grupoCategoria.style.display = 'flex';
                grupoValor.style.display = 'flex';
                document.getElementById('txt_categoria').required = true;
                document.getElementById('novo_valor_unitario').required = true;
            } else {
                grupoCategoria.style.display = 'none';
                grupoValor.style.display = 'none';
                document.getElementById('txt_categoria').required = false;
                document.getElementById('novo_valor_unitario').required = false;
            }
        });
    }

    const form = document.getElementById('form-novo-registro');
    if (form) {
        form.addEventListener('submit', processarEEnviarPedido);
    }
});

async function carregarDatalist(idDatalist, urlEndpoint, chaveId, chaveTextoOrFn, mapaArmazenamento, ehFn = false) {
    const datalist = document.getElementById(idDatalist);
    if (!datalist) return;
    try {
        const response = await fetch(urlEndpoint);
        if (!response.ok) return; // Se a rota não existir (404), sai sem quebrar o código
        const dados = await response.json();
        datalist.innerHTML = '';
        dados.forEach(item => {
            const texto = ehFn ? chaveTextoOrFn(item) : item[chaveTextoOrFn];
            if (texto) {
                const option = document.createElement('option');
                option.value = texto;
                datalist.appendChild(option);
                mapaArmazenamento[texto.toLowerCase()] = item[chaveId] || item.id_localizacao || item.id_categoria;
            }
        });
    } catch (e) { 
        // Captura o erro silenciosamente para permitir que o app continue funcionando
        console.warn(`Aviso: Não foi possível alimentar o datalist ${idDatalist}.`, e.message); 
    }
}

async function cadastrarEntidade(endpoint, payload) {
    const response = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Erro no cadastro automático.');
    return await response.json();
}

async function processarEEnviarPedido(event) {
    event.preventDefault();

    const txtCliente = document.getElementById('txt_cliente').value.trim();
    const txtVendedor = document.getElementById('txt_vendedor').value.trim();
    const txtProduto = document.getElementById('txt_produto').value.trim();
    const txtPagamento = document.getElementById('txt_tipo_pagamento').value.trim();

    try {
        let idCliente = mapaClientes[txtCliente.toLowerCase()];
        let idVendedor = mapaVendedores[txtVendedor.toLowerCase()];
        let idProduto = mapaProdutos[txtProduto.toLowerCase()];
        let idPagamento = mapaPagamentos[txtPagamento.toLowerCase()];

        // 1. Cria Localização e Cliente se não existirem
        if (!idCliente) {
            const cidadeDigitada = document.getElementById('txt_cidade').value.trim();
            const estadoDigitado = document.getElementById('txt_estado').value.trim().toUpperCase();
            
            let idLocalizacao = mapaLocalizacoes[`${cidadeDigitada} - ${estadoDigitado}`.toLowerCase()];
            
            if (!idLocalizacao) {
                const resLoc = await cadastrarEntidade('/localizacoes', { cidade: cidadeDigitada, estado: estadoDigitado });
                idLocalizacao = resLoc.id_localizacao;
            }

            const resCli = await cadastrarEntidade('/clientes', { nome_cliente: txtCliente, fk_id_localizacao: idLocalizacao });
            idCliente = resCli.id_cliente;
        }

        // 2. Cria Vendedor se não existir
        if (!idVendedor) {
            const res = await cadastrarEntidade('/vendedores', { nome_vendedor: txtVendedor });
            idVendedor = res.id_vendedor;
        }

        // 3. Cria Categoria e Produto se não existirem
        if (!idProduto) {
            const categoriaDigitada = document.getElementById('txt_categoria').value.trim();
            let idCategoria = mapaCategorias[categoriaDigitada.toLowerCase()];

            if (!idCategoria) {
                const resCat = await cadastrarEntidade('/categorias', { nome_categoria: categoriaDigitada });
                idCategoria = resCat.id_categoria;
            }

            const valorUnitario = Number(document.getElementById('novo_valor_unitario').value);
            const resProd = await cadastrarEntidade('/produtos', { 
                nome_produto: txtProduto, 
                valor_unitario: valorUnitario,
                fk_id_categoria: idCategoria 
            });
            idProduto = resProd.id_produto;
        }

        // 4. Cria Forma de Pagamento se não existir
        if (!idPagamento) {
            const res = await cadastrarEntidade('/tipos-pagamento', { nome_tipo: txtPagamento });
            idPagamento = res.id_tipo_pagamento;
        }

        // Monta o payload definitivo para a tabela 'registro'
        const payloadPedido = {
            data_pedido: document.getElementById('data_pedido').value,
            fk_id_cliente: Number(idCliente),
            fk_id_vendedor: Number(idVendedor),
            fk_id_produto: Number(idProduto),
            quantidade: Number(document.getElementById('quantidade').value),
            fk_id_tipo_pagamento: Number(idPagamento),
            nota_satisfacao: Number(document.getElementById('nota_satisfacao').value),
            observacao: document.getElementById('observacao').value.trim() || null
        };

        const responseFinal = await fetch(`${API}/dashboard/registro`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payloadPedido)
        });

        if (responseFinal.ok) {
            alert('Tudo gravado e pedido registrado com sucesso!');
            window.location.reload();
        } else {
            const msg = await responseFinal.text();
            alert('Erro ao registrar pedido: ' + msg);
        }

    } catch (erro) {
        console.error(erro);
        alert('Erro no processamento automático: ' + erro.message);
    }
}