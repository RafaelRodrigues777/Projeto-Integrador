const API = 'http://localhost:8080'

async function carregarCards() {
  try {
    const [fat, ped, cli, prod] = await Promise.all([
      fetch(`${API}/dashboard/faturamento`).then(r => r.json()),
      fetch(`${API}/dashboard/pedidos`).then(r => r.json()),
      fetch(`${API}/dashboard/clientes`).then(r => r.json()),
      fetch(`${API}/dashboard/produtos`).then(r => r.json())
    ])

    const totalFaturamento = Number(fat.total) || 0
    const totalPedidos = Number(ped.total) || 0

    // Formata o Faturamento de forma limpa
    document.getElementById('card-faturamento').textContent =
      'R$ ' + totalFaturamento.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })

    // RN11: Cálculo Dinâmico do Ticket Médio
    const ticketMedio = totalPedidos > 0 ? (totalFaturamento / totalPedidos) : 0
    document.getElementById('card-ticket-medio').textContent =
      'R$ ' + ticketMedio.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })

    document.getElementById('card-pedidos').textContent = totalPedidos.toLocaleString('pt-BR')
    document.getElementById('card-clientes').textContent = (cli.total || 0).toLocaleString('pt-BR')
    document.getElementById('card-produtos').textContent = (prod.total || 0).toLocaleString('pt-BR')

  } catch (err) {
    console.error('Erro ao carregar cards:', err)
  }
}

async function carregarGraficos() {
  try {

    // RN12: Faturamento Mensal (Com tratamento anti-bug de array vazio ou nulo)
        let faturamentoMensal = []
            try {
              faturamentoMensal = await fetch(`${API}/dashboard/faturamento-mensal`).then(r => r.json())
              
              // 🌟 ISSO AQUI VAI TE MOSTRAR O QUE ESTÁ VINDO NO F12 DO NAVEGADOR:
              console.log("DADOS QUE CHEGARAM DA API PARA O GRÁFICO MENSAL:", faturamentoMensal)

            } catch (e) {
              console.error("Erro ao buscar faturamento mensal:", e)
            }

            if (Array.isArray(faturamentoMensal) && faturamentoMensal.length > 0) {
              new Chart(document.getElementById('GraficoFaturamentoMensal'), {
                type: 'line',
                data: {
                  // 💡 IMPORTANTE: Verifique se no console os objetos têm a propriedade .mes ou outro nome!
                  labels: faturamentoMensal.map(f => f.mes || f.MES || 'Desconhecido'),
                  datasets: [{
                    label: 'Faturamento Mensal (R$)',
                    // 💡 IMPORTANTE: Verifique se no console o valor se chama .total_mes, .total ou .faturamento!
                    data: faturamentoMensal.map(f => Number(f.total_mes || f.total || f.faturamento) || 0),
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16,185,129,0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.3
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return 'R$ ' + Number(context.raw).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value) {
                          return 'R$ ' + Number(value).toLocaleString('pt-BR')
                        }
                      }
                    }
                  }
                }
              })
            } else {
              console.warn("O gráfico não foi criado porque 'faturamentoMensal' está vazio ou não é um Array.")
            }

    // Produtos mais vendidos
    const produtos = await fetch(`${API}/dashboard/produtos-mais-vendidos`).then(r => r.json())

    new Chart(document.getElementById('PrimeiroGrafico'), {
      type: 'bar',
      data: {
        labels: produtos.map(p => p.nome_produto),
        datasets: [{
          label: 'Quantidade Vendida',
          data: produtos.map(p => p.total_vendido),
          backgroundColor: 'rgba(99,102,241,0.7)',
          borderRadius: 6,
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true }
        }
      }
    })

    // Receita por vendedor
    const vendedores = await fetch(`${API}/dashboard/vendedores-receita`).then(r => r.json())

    new Chart(document.getElementById('SegundoGrafico'), {
      type: 'bar',
      data: {
        labels: vendedores.map(v => v.nome_vendedor),
        datasets: [{
          label: 'Receita (R$)',
          data: vendedores.map(v => v.total_receita),
          backgroundColor: 'rgba(16,185,129,0.7)',
          borderRadius: 6,
          borderWidth: 0
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { beginAtZero: true }
        }
      }
    })

    // Receita por estado
    const regioes = await fetch(`${API}/dashboard/desempenho-regioes`).then(r => r.json())

    new Chart(document.getElementById('TerceiroGrafico'), {
      type: 'doughnut',
      data: {
        labels: regioes.map(r => r.estado),
        datasets: [{
          label: 'Receita por Estado',
          data: regioes.map(r => r.total_receita),
          backgroundColor: [
            '#6366f1', '#10b981', '#f59e0b', '#ef4444',
            '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    })

    // Faturamento médio por satisfação
    const satisfacao = await fetch(`${API}/dashboard/faturamento-satisfacao`).then(r => r.json())

    new Chart(document.getElementById('QuartoGrafico'), {
      type: 'bar',
      data: {
        labels: satisfacao.map(s => `Nota ${s.nota_satisfacao}`),
        datasets: [{
          label: 'Faturamento Médio (R$)',
          data: satisfacao.map(s => Number(s.media_faturamento)),
          backgroundColor: ['#ef4444', '#f97316', '#facc15', '#22c55e', '#3b82f6'],
          borderRadius: 8,
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Faturamento Médio por Nota de Satisfação' },
          tooltip: {
            callbacks: {
              label: function(context) {
                return 'R$ ' + Number(context.raw).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) { return 'R$ ' + Number(value).toLocaleString('pt-BR') }
            }
          }
        }
      }
    })

  } catch (err) {
    console.error('Erro ao carregar gráficos:', err)
  }
}

carregarCards()
carregarGraficos()