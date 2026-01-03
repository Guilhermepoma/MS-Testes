/**
 * JavaScript para Página Metas
 * Dashboard MS
 */

let graficoToneladas = null;
let graficoVoluntarios = null;
let dadosToneladas = [];
let dadosVoluntarios = [];

// Carregar dados
async function carregarDados() {
    try {
        const response = await fetch('../api/metas.php');
        const result = await response.json();
        
        if (result.success) {
            dadosToneladas = result.data.toneladas;
            dadosVoluntarios = result.data.voluntarios;
            
            criarGraficoToneladas();
            criarGraficoVoluntarios();
            renderizarTabelas();
        } else {
            console.error('Erro ao carregar dados:', result.message);
            mostrarMensagem('Erro ao carregar dados', 'error');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        mostrarMensagem('Erro de conexão', 'error');
    }
}

// Criar gráfico de pizza - Toneladas
function criarGraficoToneladas() {
    const ctx = document.getElementById('graficoToneladas').getContext('2d');
    
    if (graficoToneladas) {
        graficoToneladas.destroy();
    }
    
    const labels = dadosToneladas.map(d => d.ano.toString());
    const data = dadosToneladas.map(d => parseFloat(d.toneladas));
    const colors = dadosToneladas.map(d => d.cor);
    
    graficoToneladas = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderColor: '#1e2936',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#b8c5d6',
                        font: {
                            size: 12
                        },
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#f7d708',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} ton (${percentage}%)`;
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1500
            }
        }
    });
}

// Criar gráfico de pizza - Voluntários
function criarGraficoVoluntarios() {
    const ctx = document.getElementById('graficoVoluntarios').getContext('2d');
    
    if (graficoVoluntarios) {
        graficoVoluntarios.destroy();
    }
    
    const labels = dadosVoluntarios.map(d => d.ano.toString());
    const data = dadosVoluntarios.map(d => parseInt(d.quantidade));
    const colors = dadosVoluntarios.map(d => d.cor);
    
    graficoVoluntarios = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderColor: '#1e2936',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#b8c5d6',
                        font: {
                            size: 12
                        },
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#f7d708',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} voluntários (${percentage}%)`;
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1500
            }
        }
    });
}

// Renderizar tabelas de dados
function renderizarTabelas() {
    // Tabela Toneladas
    const tabelaToneladas = document.getElementById('tabelaToneladas');
    tabelaToneladas.innerHTML = `
        <table style="width: 100%; color: var(--text-primary);">
            <thead>
                <tr style="border-bottom: 2px solid var(--border-color);">
                    <th style="padding: 10px; text-align: left;">Ano</th>
                    <th style="padding: 10px; text-align: right;">Toneladas</th>
                    <th style="padding: 10px; text-align: center;">Cor</th>
                </tr>
            </thead>
            <tbody>
                ${dadosToneladas.map(d => `
                    <tr style="border-bottom: 1px solid var(--border-color);">
                        <td style="padding: 10px;">${d.ano}</td>
                        <td style="padding: 10px; text-align: right;">${d.toneladas}</td>
                        <td style="padding: 10px; text-align: center;">
                            <span style="display: inline-block; width: 30px; height: 20px; background-color: ${d.cor}; border-radius: 4px;"></span>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    // Tabela Voluntários
    const tabelaVoluntarios = document.getElementById('tabelaVoluntarios');
    tabelaVoluntarios.innerHTML = `
        <table style="width: 100%; color: var(--text-primary);">
            <thead>
                <tr style="border-bottom: 2px solid var(--border-color);">
                    <th style="padding: 10px; text-align: left;">Ano</th>
                    <th style="padding: 10px; text-align: right;">Quantidade</th>
                    <th style="padding: 10px; text-align: center;">Cor</th>
                </tr>
            </thead>
            <tbody>
                ${dadosVoluntarios.map(d => `
                    <tr style="border-bottom: 1px solid var(--border-color);">
                        <td style="padding: 10px;">${d.ano}</td>
                        <td style="padding: 10px; text-align: right;">${d.quantidade}</td>
                        <td style="padding: 10px; text-align: center;">
                            <span style="display: inline-block; width: 30px; height: 20px; background-color: ${d.cor}; border-radius: 4px;"></span>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Abrir modal para adicionar
function abrirModalAdicionar() {
    document.getElementById('modalTitulo').textContent = 'Adicionar Meta';
    document.getElementById('formMeta').reset();
    document.getElementById('metaId').value = '';
    document.getElementById('metaCor').value = gerarCorAleatoria();
    document.getElementById('modalMeta').classList.add('active');
}

// Editar dados
function editarDados(tipo) {
    // Simplificado: abre modal para adicionar novo registro
    abrirModalAdicionar();
    document.getElementById('metaTipo').value = tipo;
}

// Fechar modal
function fecharModal() {
    document.getElementById('modalMeta').classList.remove('active');
}

// Salvar meta
async function salvarMeta(event) {
    event.preventDefault();
    
    const tipo = document.getElementById('metaTipo').value;
    const ano = document.getElementById('metaAno').value;
    const valor = document.getElementById('metaValor').value;
    const cor = document.getElementById('metaCor').value;
    const id = document.getElementById('metaId').value;
    
    try {
        const method = id ? 'PUT' : 'POST';
        const body = {
            tipo: tipo,
            ano: parseInt(ano),
            valor: parseFloat(valor),
            cor: cor
        };
        
        if (id) {
            body.id = parseInt(id);
        }
        
        const response = await fetch('../api/metas.php', {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        const result = await response.json();
        
        if (result.success) {
            mostrarMensagem('Meta salva com sucesso!', 'success');
            fecharModal();
            carregarDados();
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('Erro ao salvar meta:', error);
        mostrarMensagem('Erro ao salvar meta: ' + error.message, 'error');
    }
}

// Gerar cor aleatória
function gerarCorAleatoria() {
    const cores = [
        '#034794', '#0056b3', '#f7d708', '#f76b07', 
        '#28a745', '#6f42c1', '#d11507', '#20c997', 
        '#ff5733', '#ffc107', '#17a2b8', '#e83e8c'
    ];
    return cores[Math.floor(Math.random() * cores.length)];
}

// Mostrar mensagem
function mostrarMensagem(texto, tipo) {
    const msg = document.createElement('div');
    msg.textContent = texto;
    msg.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 3000;
        animation: slideIn 0.3s ease;
        background-color: ${tipo === 'success' ? '#28a745' : '#d11507'};
    `;
    
    document.body.appendChild(msg);
    
    setTimeout(() => {
        msg.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => msg.remove(), 300);
    }, 3000);
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        fecharModal();
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    carregarDados();
});
