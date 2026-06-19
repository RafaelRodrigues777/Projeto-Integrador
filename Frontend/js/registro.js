const API = 'http://localhost:8080'

// Executa assim que a página relatorios.html termina de carregar
document.addEventListener('DOMContentLoaded', () => {
  // Define a data atual como padrão no input date
  document.getElementById('data_pedido').valueAsDate = new Date()

  // Alimenta os comboboxes buscando os dados reais do seu banco via API
  populaSelect('fk_id_cliente', `${API}/clientes`, 'id_cliente', 'nome_cliente')
  populaSelect('fk_id_vendedor', `${API}/vendedores`, 'id_vendedor', 'nome_vendedor')
  populaSelect('fk_id_produto', `${API}/produtos`, 'id_produto', 'nome_produto')
  populaSelect('fk_id_tipo_pagamento', `${API}/tipos-pagamento`, 'id_tipo_pagamento', 'nome_tipo')

  // Fica de olho no envio do formulário
  const form = document.getElementById('form-novo-registro')
  form.addEventListener('submit', enviarNovoPedido)
})

// Função utilitária para buscar os dados das chaves estrangeiras e preencher as tags <select>
async function populaSelect(idElemento, urlEndpoint, chaveValor, chaveTexto) {
  try {
    const response = await fetch(urlEndpoint)
    if (!response.ok) throw new Error(`Erro na requisição da URL: ${urlEndpoint}`)
    
    const listaDados = await response.json()
    const campoSelect = document.getElementById(idElemento)

    listaDados.forEach(item => {
      const option = document.createElement('option')
      option.value = item[chaveValor]
      option.textContent = item[chaveTexto]
      campoSelect.appendChild(option)
    })
  } catch (error) {
    console.error(`Erro ao tentar carregar o select [${idElemento}]:`, error)
  }
}

// Envia os dados estruturados do formulário para o controller no backend
async function enviarNovoPedido(event) {
  event.preventDefault()

  // Agrupa os valores capturados da tela batendo com a estrutura do req.body do back
  const payloadPedido = {
    data_pedido: document.getElementById('data_pedido').value,
    fk_id_cliente: parseInt(document.getElementById('fk_id_cliente').value),
    fk_id_vendedor: parseInt(document.getElementById('fk_id_vendedor').value),
    fk_id_produto: parseInt(document.getElementById('fk_id_produto').value),
    quantidade: parseInt(document.getElementById('quantidade').value),
    fk_id_tipo_pagamento: parseInt(document.getElementById('fk_id_tipo_pagamento').value),
    nota_satisfacao: parseInt(document.getElementById('nota_satisfacao').value),
    observacao: document.getElementById('observacao').value || null
  }

  try {
    const response = await fetch(`${API}/dashboard/registro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payloadPedido)
    })

    if (response.ok) {
      alert('Pedido gravado com sucesso!')
      
      // Reseta os campos do formulário após a gravação
      document.getElementById('form-novo-registro').reset()
      document.getElementById('data_pedido').valueAsDate = new Date()
    } else {
      const textoErro = await response.text()
      alert(`Erro retornado pelo servidor: ${textoErro}`)
    }
  } catch (error) {
    console.error('Erro de rede/comunicação ao salvar pedido:', error)
    alert('Não foi possível conectar ao servidor backend.')
  }
}