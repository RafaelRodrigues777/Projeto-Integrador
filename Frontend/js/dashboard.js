const API = 'http://localhost:8080'

  async function carregarCards() {
    try {
      const [fat, ped, cli, prod] = await Promise.all([
        fetch(`${API}/dashboard/faturamento`).then(r => r.json()),
        fetch(`${API}/dashboard/pedidos`).then(r => r.json()),
        fetch(`${API}/dashboard/clientes`).then(r => r.json()),
        fetch(`${API}/dashboard/produtos`).then(r => r.json()),
      ])

      document.getElementById('card-faturamento').textContent =
        'R$ ' + Number(fat.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })

      document.getElementById('card-pedidos').textContent = ped.total
      document.getElementById('card-clientes').textContent = cli.total
      document.getElementById('card-produtos').textContent = prod.total

    } catch (err) {
      console.error('Erro ao carregar cards:', err)
    }
  }

  async function carregarGraficos() {
    try {

      const produtos = await fetch(`${API}/dashboard/produtos-mais-vendidos`).then(r => r.json())
      new Chart(document.getElementById('PrimeiroGrafico'), {
        type: 'bar',
        data: {
          labels: produtos.map(p => p.nome_produto),
          datasets: [{
            label: 'Quantidade vendida',
            data: produtos.map(p => p.total_vendido),
            backgroundColor: 'rgba(99, 102, 241, 0.7)',
            borderRadius: 6,
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true } }
        }
      })

      const vendedores = await fetch(`${API}/dashboard/vendedores-receita`).then(r => r.json())
      new Chart(document.getElementById('SegundoGrafico'), {
        type: 'bar',
        data: {
          labels: vendedores.map(v => v.nome_vendedor),
          datasets: [{
            label: 'Receita (R$)',
            data: vendedores.map(v => v.total_receita),
            backgroundColor: 'rgba(16, 185, 129, 0.7)',
            borderRadius: 6,
            borderWidth: 0
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          scales: { x: { beginAtZero: true } }
        }
      })

      const regioes = await fetch(`${API}/dashboard/desempenho-regioes`).then(r => r.json())
      new Chart(document.getElementById('TerceiroGrafico'), {
        type: 'doughnut',
        data: {
          labels: regioes.map(r => r.estado),
          datasets: [{
            label: 'Receita por estado (R$)',
            data: regioes.map(r => r.total_receita),
            backgroundColor: [
              '#6366f1','#10b981','#f59e0b','#ef4444',
              '#3b82f6','#8b5cf6','#ec4899','#14b8a6'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      })

      const satisfacao = await fetch(`${API}/dashboard/faturamento-satisfacao`).then(r => r.json())
      new Chart(document.getElementById('QuartoGrafico'), {
        type: 'line',
        data: {
          labels: satisfacao.map(s => `Nota ${s.nota_satisfacao}`),
          datasets: [
            {
              label: 'Faturamento médio (R$)',
              data: satisfacao.map(s => s.media_faturamento),
              borderColor: '#6366f1',
              backgroundColor: 'rgba(99,102,241,0.1)',
              tension: 0.4,
              fill: true,
              yAxisID: 'y'
            },
            {
              label: 'Total de pedidos',
              data: satisfacao.map(s => s.total_pedidos),
              borderColor: '#f59e0b',
              backgroundColor: 'rgba(245,158,11,0.1)',
              tension: 0.4,
              fill: true,
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y:  { beginAtZero: true, position: 'left' },
            y1: { beginAtZero: true, position: 'right', grid: { drawOnChartArea: false } }
          }
        }
      })

    } catch (err) {
      console.error('Erro ao carregar gráficos:', err)
    }
  }

  carregarCards()
  carregarGraficos()