const API_URL = 'http://localhost:8080';

document.addEventListener('DOMContentLoaded', async () => {
    await carregarHistoricoPedidos();
});

async function carregarHistoricoPedidos() {
    const corpoTabela = document.getElementById('tabela-pedidos-corpo');
    if (!corpoTabela) return;

    try {
        const response = await fetch(`${API_URL}/dashboard/pedidos-detalhes`);
        if (!response.ok) throw new Error('Não foi possível obter os dados do servidor.');

        const pedidos = await response.json();

        if (pedidos.length === 0) {
            corpoTabela.innerHTML = `<tr><td colspan="10" style="text-align: center;">Nenhum pedido encontrado no sistema.</td></tr>`;
            return;
        }

        corpoTabela.innerHTML = ''; // Limpa a mensagem de carregando

        pedidos.forEach(pedido => {
            // Formata a data do banco para formato legível (DD/MM/AAAA)
            const dataFormatada = new Date(pedido.data_pedido).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
            
            // Formata os valores monetários
            const valorUnitario = Number(pedido.valor_unitario).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            const valorTotal = Number(pedido.valor_total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>#${pedido.id_registro}</strong></td>
                <td>${dataFormatada}</td>
                <td>
                    <strong>${pedido.nome_cliente}</strong><br>
                    <small style="color: #666;">${pedido.cidade} - ${pedido.estado}</small>
                </td>
                <td>${pedido.nome_vendedor}</td>
                <td>
                    ${pedido.nome_produto}<br>
                    <small style="color: #888; background: #f0f0f0; padding: 2px 4px; border-radius: 3px;">${pedido.nome_categoria}</small>
                </td>
                <td>${pedido.quantidade} × ${valorUnitario}</td>
                <td><strong>${valorTotal}</strong></td>
                <td>${pedido.forma_pagamento}</td>
                <td><span class="badge-nota">${pedido.nota_satisfacao}</span></td>
                <td><small style="color: #555;">${pedido.observacao || '-'}</small></td>
            `;
            corpoTabela.appendChild(tr);
        });

    } catch (error) {
        console.error(error);
        corpoTabela.innerHTML = `<tr><td colspan="10" style="text-align: center; color: red;">Erro ao carregar pedidos: ${error.message}</td></tr>`;
    }
}