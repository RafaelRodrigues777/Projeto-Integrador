const API = 'http://localhost:8080'

// Definição das cores oficiais mapeadas para o Chart.js
const CORES_PALETA = {
  steel: '#5b88a5',
  steelLight: 'rgba(91, 136, 165, 0.2)',
  navy: '#243a69',
  navyLight: 'rgba(36, 58, 105, 0.1)',
  stone: '#d4cdc5',
  ink: '#191013',
  // Tons complementares frios para o gráfico de rosca
  donut: ['#243a69', '#5b88a5', '#8ba6ac', '#bdcdd0', '#a2b5bb', '#ced9db']
};

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
    // 1. Produtos Mais Vendidos (Barras Verticais usando Steel)
    const produtos = await fetch(`${API}/dashboard/produtos-mais-vendidos`).then(r => r.json())
    new Chart(document.getElementById('PrimeiroGrafico'), {
      type: 'bar',
      data: {
        labels: produtos.map(p => p.nome_produto),
        datasets: [{
          label: 'Quantidade vendida',
          data: produtos.map(p => p.total_vendido),
          backgroundColor: CORES_PALETA.steel,
          borderRadius: 4,
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, grid: { color: '#eaeaea' } }, x: { grid: { display: false } } }
      }
    })

    // 2. Vendedores (Barras Horizontais usando Navy)
    const vendedores = await fetch(`${API}/dashboard/vendedores-receita`).then(r => r.json())
    new Chart(document.getElementById('SegundoGrafico'), {
      type: 'bar',
      data: {
        labels: vendedores.map(v => v.nome_vendedor),
        datasets: [{
          label: 'Receita (R$)',
          data: vendedores.map(v => v.total_receita),
          backgroundColor: CORES_PALETA.navy,
          borderRadius: 4,
          borderWidth: 0
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { beginAtZero: true, grid: { color: '#eaeaea' } }, y: { grid: { display: false } } }
      }
    })

    // 3. Desempenho Regional (Donut com degradê de tons frios)
    const regioes = await fetch(`${API}/dashboard/desempenho-regioes`).then(r => r.json())
    new Chart(document.getElementById('TerceiroGrafico'), {
      type: 'doughnut',
      data: {
        labels: regioes.map(r => r.estado),
        datasets: [{
          data: regioes.map(r => r.total_receita),
          backgroundColor: CORES_PALETA.donut,
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'right', labels: { boxWidth: 12, font: { family: 'Inter' } } } }
      }
    })

    // 4. Satisfação vs Faturamento (Linhas Suaves combinando Navy e Steel)
    const satisfacao = await fetch(`${API}/dashboard/faturamento-satisfacao`).then(r => r.json())
    new Chart(document.getElementById('QuartoGrafico'), {
      type: 'line',
      data: {
        labels: satisfacao.map(s => `Nota ${s.nota_satisfacao}`),
        datasets: [
          {
            label: 'Faturamento médio (R$)',
            data: satisfacao.map(s => s.media_faturamento),
            borderColor: CORES_PALETA.navy,
            backgroundColor: CORES_PALETA.navyLight,
            tension: 0.35,
            fill: true,
            yAxisID: 'y'
          },
          {
            label: 'Total de pedidos',
            data: satisfacao.map(s => s.total_pedidos),
            borderColor: CORES_PALETA.steel,
            backgroundColor: CORES_PALETA.steelLight,
            tension: 0.35,
            fill: true,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y:  { beginAtZero: true, position: 'left', grid: { color: '#eaeaea' } },
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