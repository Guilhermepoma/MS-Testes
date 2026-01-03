/**
 * JavaScript para a página pública de Metas (metas.html)
 * Carrega dados da API e renderiza o gráfico e as estatísticas.
 */

let graficoGeral = null;

// Função para carregar dados da API
async function carregarDadosMetas() {
    try {
        // A API de metas retorna dados de toneladas e voluntários
        const response = await fetch('api/metas.php');
        const result = await response.json();
        
        if (result.success) {
            const toneladas = result.data.toneladas;
            const voluntarios = result.data.voluntarios;
            
            // 1. Criar o Gráfico Geral (Toneladas)
            criarGraficoGeral(toneladas);
            
            // 2. Renderizar Estatísticas e Detalhes
            renderizarEstatisticas(toneladas, voluntarios);
            
        } else {
            console.error('Erro ao carregar dados de metas:', result.message);
        }
    } catch (error) {
        console.error('Erro na requisição de metas:', error);
    }
}

// Cria o gráfico de barras de Toneladas Arrecadadas
function criarGraficoGeral(toneladas) {
    const ctx = document.getElementById('graficoGeral').getContext('2d');
    
    if (graficoGeral) {
        graficoGeral.destroy();
    }
    
    const labels = toneladas.map(d => d.ano.toString());
    const data = toneladas.map(d => parseFloat(d.toneladas));
    const colors = toneladas.map(d => d.cor);
    
    graficoGeral = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Toneladas Arrecadadas',
                data: data,
                backgroundColor: colors,
                borderColor: colors,
                borderWidth: 1,
                borderRadius: 5,
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
                    callbacks: {
                        label: function(context) {
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
                        text: 'Toneladas'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Anos'
                    }
                }
            }
        }
    });
}

// Renderiza as estatísticas e o detalhamento por ano
function renderizarEstatisticas(toneladas, voluntarios) {
    // 1. Estatísticas Gerais
    const totalToneladas = toneladas.reduce((sum, d) => sum + parseFloat(d.toneladas), 0).toFixed(1);
    const totalEdicoes = toneladas.length;
    const ultimoAnoVoluntarios = voluntarios.length > 0 ? voluntarios[voluntarios.length - 1] : { quantidade: 'N/A' };
    
    document.querySelector('.stat-card:nth-child(1) .stat-number').textContent = totalToneladas;
    document.querySelector('.stat-card:nth-child(2) .stat-number').textContent = totalEdicoes;
    document.querySelector('.stat-card:nth-child(3) .stat-number').textContent = ultimoAnoVoluntarios.quantidade;
    
    // 2. Detalhamento por Ano
    const anosGrid = document.querySelector('.anos-grid');
    anosGrid.innerHTML = ''; // Limpa o conteúdo estático
    
    // Combina dados de toneladas e voluntários por ano
    const dadosCombinados = toneladas.map(t => {
        const v = voluntarios.find(vol => vol.ano === t.ano);
        return {
            ano: t.ano,
            toneladas: t.toneladas,
            voluntarios: v ? v.quantidade : 'N/A'
        };
    }).reverse(); // Exibe do mais recente para o mais antigo
    
    dadosCombinados.forEach(d => {
        const anoCard = document.createElement('div');
        anoCard.classList.add('ano-card');
        anoCard.innerHTML = `
            <h4>${d.ano}</h4>
            <p><strong>${d.toneladas} toneladas</strong> arrecadadas</p>
            <p>${d.voluntarios} voluntários envolvidos</p>
        `;
        anosGrid.appendChild(anoCard);
    });
}

// Inicializa o carregamento dos dados
document.addEventListener('DOMContentLoaded', carregarDadosMetas);
