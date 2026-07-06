const API = 'http://localhost:8080';

document.addEventListener('DOMContentLoaded', () => {
    const campoData = document.getElementById('data_pedido');

    if (campoData) {
        campoData.valueAsDate = new Date();
    }

    // Carrega os selects
    populaSelect('fk_id_cliente', `${API}/clientes`, 'id_cliente', 'nome_cliente');
    populaSelect('fk_id_vendedor', `${API}/vendedores`, 'id_vendedor', 'nome_vendedor');
    populaSelect('fk_id_produto', `${API}/produtos`, 'id_produto', 'nome_produto');
    populaSelect('fk_id_tipo_pagamento', `${API}/tipos-pagamento`, 'id_tipo_pagamento', 'nome_tipo');

    document
        .getElementById('form-novo-registro')
        .addEventListener('submit', enviarNovoPedido);
});

async function populaSelect(idElemento, urlEndpoint, chaveValor, chaveTexto) {
    try {
        const response = await fetch(urlEndpoint);

        if (!response.ok) {
            throw new Error(`Erro ao carregar ${urlEndpoint}`);
        }

        const dados = await response.json();

        const select = document.getElementById(idElemento);

        select.innerHTML = '<option value="">Selecione...</option>';

        dados.forEach(item => {
            const option = document.createElement('option');
            option.value = item[chaveValor];
            option.textContent = item[chaveTexto];
            select.appendChild(option);
        });

    } catch (erro) {
        console.error(erro);

        const select = document.getElementById(idElemento);

        if (select) {
            select.innerHTML = '<option value="">Erro ao carregar</option>';
        }
    }
}

async function enviarNovoPedido(event) {
    event.preventDefault();

    const payloadPedido = {
        data_pedido: document.getElementById('data_pedido').value,
        fk_id_cliente: Number(document.getElementById('fk_id_cliente').value),
        fk_id_vendedor: Number(document.getElementById('fk_id_vendedor').value),
        fk_id_produto: Number(document.getElementById('fk_id_produto').value),
        quantidade: Number(document.getElementById('quantidade').value),
        fk_id_tipo_pagamento: Number(document.getElementById('fk_id_tipo_pagamento').value),
        nota_satisfacao: Number(document.getElementById('nota_satisfacao').value),
        observacao: document.getElementById('observacao').value.trim() || null
    };

    console.log('Enviando:', payloadPedido);

    try {
        const response = await fetch(`${API}/dashboard/registro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payloadPedido)
        });

        const resposta = await response.text();

        if (response.ok) {
            alert('Pedido registrado com sucesso!');

            document.getElementById('form-novo-registro').reset();
            document.getElementById('data_pedido').valueAsDate = new Date();

        } else {
            console.error(resposta);
            alert(resposta);
        }

    } catch (erro) {
        console.error('Erro:', erro);
        alert('Não foi possível conectar ao servidor.');
    }
}