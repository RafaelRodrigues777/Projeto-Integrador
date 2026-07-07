const server = "http://localhost:8080"
const corpoTabela = document.getElementById('corpo-tabela-produtos')

// ==========================================
// BUSCAR E RENDERIZAR OS PRODUTOS NA TABELA
// ==========================================
async function listarProdutos() {
    try {
        const response = await fetch(`${server}/produtos`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })

        const result = await response.json()

        if (response.ok) {
            corpoTabela.innerHTML = ''
            
            if (result.length === 0) {
                corpoTabela.innerHTML = `
                    <tr>
                        <td colspan="5" style="text-align: center; padding: 24px; color: #777;">
                            Nenhum produto encontrado.
                        </td>
                    </tr>
                `
                return
            }

            result.forEach(produto => {
                const linha = document.createElement('tr')

                const precoFormatado = new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }).format(produto.valor_unitario)

                // Renderiza as 5 colunas: ID, Nome, Categoria, Preço e o Botão de Lixeira
                linha.innerHTML = `
                    <td>#${produto.id_produto}</td>
                    <td class="nome-produto" style="font-weight: 500; color: var(--clr-ink);">${produto.nome_produto}</td>
                    <td>${produto.nome_categoria || 'Sem Categoria'}</td>
                    <td class="alinhamento-direita" style="font-weight: 500;">${precoFormatado}</td>
                    <td style="text-align: center;">
                        <button class="btn-deletar-coluna" data-id="${produto.id_produto}" title="Excluir Produto" style="background: transparent; border: none; cursor: pointer; color: #c0392b; padding: 4px 8px; border-radius: 4px; transition: background 0.2s;">
                            <i class="ti ti-trash" style="font-size: 16px; pointer-events: none;"></i>
                        </button>
                    </td>
                `

                corpoTabela.appendChild(linha)
            })

        } else {
            alert(result.message || 'Erro ao buscar produtos')
            exibirMensagemErro()
        }

    } catch (error) {
        console.error('Erro ao conectar com o servidor:', error)
        exibirMensagemErro()
    }
}

// Oculta o loading e exibe aviso de falha de conexão
function exibirMensagemErro() {
    corpoTabela.innerHTML = `
        <tr>
            <td colspan="5" style="text-align: center; padding: 24px; color: #c0392b; font-weight: 500;">
                <i class="ti ti-alert-triangle"></i> Erro ao carregar os dados do banco.
            </td>
        </tr>
    `
}

// ==========================================
// LOGICA DE EVENTOS (CLIQUE NA LIXEIRA E HOVER)
// ==========================================
if (corpoTabela) {
    // Escuta cliques nas lixeiras individuais
    corpoTabela.addEventListener('click', async (event) => {
        const botaoDeletar = event.target.closest('.btn-deletar-coluna');
        if (!botaoDeletar) return; // Se não foi na lixeira, ignora o clique

        let idProduto = botaoDeletar.getAttribute('data-id');
        const linhaTr = botaoDeletar.closest('tr');
        const nomeProduto = linhaTr.querySelector('.nome-produto')?.textContent || '';

        // Purifica o ID: remove qualquer '#' ou espaços gerados pela tabela
        if (idProduto) {
            idProduto = idProduto.replace('#', '').trim();
        } else {
            idProduto = linhaTr.cells[0].textContent.replace('#', '').trim();
        }

        const confirmar = confirm(`Tem certeza que deseja excluir o produto "${nomeProduto}" (ID: ${idProduto})?`);
        if (!confirmar) return;

        try {
            const response = await fetch(`${server}/produtos/${idProduto}`, {
                method: 'DELETE'
            });

            const mensagem = await response.text();

            if (response.ok) {
                alert('Produto excluído com sucesso!');
                linhaTr.remove(); // Remove a linha do HTML instantaneamente
                
                // Dispara a atualização dos contadores que estão no HTML
                if (typeof atualizarContador === 'function') atualizarContador();
            } else {
                // Exibe o erro real vindo do tratamento do seu controller
                alert(mensagem);
            }

        } catch (error) {
            console.error(error);
            alert('Erro de conexão ao tentar excluir o produto.');
        }
    });

    // Feedback visual do fundo da lixeira ao passar o mouse (Hover)
    corpoTabela.addEventListener('mouseover', (event) => {
        const botao = event.target.closest('.btn-deletar-coluna');
        if (botao) botao.style.background = '#fff0f0';
    });
    
    corpoTabela.addEventListener('mouseout', (event) => {
        const botao = event.target.closest('.btn-deletar-coluna');
        if (botao) botao.style.background = 'transparent';
    });
}

// Inicia a busca automática quando a página carregar
document.addEventListener('DOMContentLoaded', listarProdutos)