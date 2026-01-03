/**
 * JavaScript para Página Home
 * Dashboard MS
 */

// Configuração do gráfico baseado no arquivo fornecido
let graficoGeral = null;

// Carregar dados da API
async function carregarDados() {
    try {
        const response = await fetch('../api/home.php');
        const result = await response.json();

        if (result.success) {
            // Atualizar cards
            document.getElementById('totalKg').textContent = result.data.cards.total_kg;
            document.getElementById('totalVoluntarios').textContent = result.data.cards.total_voluntarios;
            document.getElementById('totalEdicoes').textContent = result.data.cards.total_edicoes;

            // Criar gráfico
            criarGrafico(result.data.grafico);
        } else {
            console.error('Erro ao carregar dados:', result.message);
            // Usar dados padrão se a API falhar
            usarDadosPadrao();
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        // Usar dados padrão se houver erro de conexão
        usarDadosPadrao();
    }
}

// Criar gráfico com Chart.js
function criarGrafico(dados) {
    const ctx = document.getElementById('graficoGeral').getContext('2d');

    // Destruir gráfico anterior se existir
    if (graficoGeral) {
        graficoGeral.destroy();
    }

    graficoGeral = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dados.labels,
            datasets: [{
                label: 'Toneladas Arrecadadas',
                data: dados.data,
                backgroundColor: dados.colors,
                borderColor: dados.colors,
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#f7d708',
                    borderWidth: 1,
                    callbacks: {
                        label: function (context) {
                            return context.parsed.y + ' toneladas';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Toneladas',
                        color: '#b8c5d6',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(184, 197, 214, 0.1)'
                    },
                    ticks: {
                        color: '#b8c5d6'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Anos',
                        color: '#b8c5d6',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#b8c5d6'
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Usar dados padrão do arquivo fornecido
function usarDadosPadrao() {
    const dadosPadrao = {
        labels: ['2019', '2020', '2021', '2022', '2023', '2024', '2025'],
        data: [10, 12, 14, 16, 18, 20, 22],
        colors: [
            '#034794',
            '#0056b3',
            '#f7d708',
            '#f76b07',
            '#28a745',
            '#6f42c1',
            '#d11507'
        ]
    };

    criarGrafico(dadosPadrao);
}

// Inicializar ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    carregarDados();
});
