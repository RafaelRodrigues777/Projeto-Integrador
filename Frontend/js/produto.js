const server = "http://localhost:8080"
const corpoTabela = document.getElementById('corpo-tabela-produtos')

async function listarProdutos() {
    try {        const response = await fetch(`${server}/produtos`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })

        const result = await response.json()

        if (response.ok) {
            corpoTabela.innerHTML = ''
            if (result.length === 0) {
                corpoTabela.innerHTML = `
                    <tr>
                        <td colspan="4" style="text-align: center; padding: 24px; color: #777;">
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

                linha.innerHTML = `
                    <td class="tabela-dados__id">#${produto.id_produto}</td>
                    <td style="font-weight: 500; color: #1a1a18;">${produto.nome_produto}</td>
                    <td>${produto.nome_categoria}</td>
                    <td class="alinhamento-direita" style="font-weight: 500;">${precoFormatado}</td>
                `

                corpoTabela.appendChild(linha)
            })

        } else {
            alert(result.message)
            exibirMensagemErro()
        }

    } catch (error) {
        console.error('Erro ao conectar com o servidor:', error)
        exibirMensagemErro()
    }
}

function exibirMensagemErro() {
    corpoTabela.innerHTML = `
        <tr>
            <td colspan="4" style="text-align: center; padding: 24px; color: #c0392b; font-weight: 500;">
                <i class="ti ti-alert-triangle"></i> Erro ao carregar os dados do banco.
            </td>
        </tr>
    `
}

document.addEventListener('DOMContentLoaded', listarProdutos)