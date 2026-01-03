/**
 * JavaScript para Página Voluntários
 * Dashboard MS
 */

let voluntarios = [];
let voluntariosSelecionados = [];

// Carregar voluntários
async function carregarVoluntarios() {
    try {
        const response = await fetch('../api/voluntarios.php');
        const result = await response.json();
        
        if (result.success) {
            voluntarios = result.data;
            renderizarVoluntarios();
        } else {
            console.error('Erro ao carregar voluntários:', result.message);
            mostrarMensagem('Erro ao carregar voluntários', 'error');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        mostrarMensagem('Erro de conexão', 'error');
    }
}

// Renderizar lista de voluntários
function renderizarVoluntarios() {
    const container = document.getElementById('voluntariosList');
    
    if (voluntarios.length === 0) {
        container.innerHTML = '<p class="text-center" style="color: var(--text-secondary); padding: 40px;">Nenhum voluntário cadastrado. Clique em "Adicionar Voluntário" para começar.</p>';
        return;
    }
    
    container.innerHTML = voluntarios.map(v => `
        <div class="volunteer-item">
            <input type="checkbox" 
                   class="volunteer-checkbox" 
                   value="${v.id}"
                   onchange="toggleSelecao(${v.id})">
            <img src="../${v.foto_url}" 
                 alt="${v.nome}" 
                 class="volunteer-avatar"
                 onerror="this.src='../assets/images/dashboard_imgs/avatar-default.png'">
            <div class="volunteer-info">
                <div class="volunteer-name">${v.nome}</div>
                <div class="volunteer-year">Ano de participação: ${v.ano_participacao}</div>
            </div>
            <button class="btn btn-secondary" onclick="editarVoluntario(${v.id})" style="margin-left: auto;">
                Editar
            </button>
        </div>
    `).join('');
    
    atualizarBotaoRemover();
}

// Toggle seleção
function toggleSelecao(id) {
    const index = voluntariosSelecionados.indexOf(id);
    if (index > -1) {
        voluntariosSelecionados.splice(index, 1);
    } else {
        voluntariosSelecionados.push(id);
    }
    atualizarBotaoRemover();
}

// Atualizar botão remover
function atualizarBotaoRemover() {
    const btnRemover = document.getElementById('btnRemover');
    if (voluntariosSelecionados.length > 0) {
        btnRemover.style.display = 'block';
        btnRemover.textContent = `Remover Selecionados (${voluntariosSelecionados.length})`;
    } else {
        btnRemover.style.display = 'none';
    }
}

// Abrir modal para adicionar
function abrirModalAdicionar() {
    document.getElementById('modalTitulo').textContent = 'Adicionar Voluntário';
    document.getElementById('formVoluntario').reset();
    document.getElementById('voluntarioId').value = '';
    document.getElementById('voluntarioAno').value = new Date().getFullYear();
    document.getElementById('modalVoluntario').classList.add('active');
}

// Editar voluntário
function editarVoluntario(id) {
    const voluntario = voluntarios.find(v => v.id === id);
    if (!voluntario) return;
    
    document.getElementById('modalTitulo').textContent = 'Editar Voluntário';
    document.getElementById('voluntarioId').value = voluntario.id;
    document.getElementById('voluntarioNome').value = voluntario.nome;
    document.getElementById('voluntarioFoto').value = voluntario.foto_url;
    document.getElementById('voluntarioAno').value = voluntario.ano_participacao;
    document.getElementById('modalVoluntario').classList.add('active');
}

// Fechar modal
function fecharModal() {
    document.getElementById('modalVoluntario').classList.remove('active');
}

// Salvar voluntário
async function salvarVoluntario(event) {
    event.preventDefault();
    
    const id = document.getElementById('voluntarioId').value;
    const nome = document.getElementById('voluntarioNome').value;
    let fotoUrl = document.getElementById('voluntarioFoto').value;
    const ano = document.getElementById('voluntarioAno').value;
    const fotoFile = document.getElementById('voluntarioFotoFile').files[0];
    
    try {
        // Se houver upload de foto, fazer upload primeiro
        if (fotoFile) {
            const formData = new FormData();
            formData.append('imagem', fotoFile);
            
            const uploadResponse = await fetch('../api/upload.php', {
                method: 'POST',
                body: formData
            });
            const uploadResult = await uploadResponse.json();
            
            if (uploadResult.success) {
                fotoUrl = uploadResult.url;
            } else {
                throw new Error('Erro no upload da foto');
            }
        }
        
        // Salvar voluntário
        const method = id ? 'PUT' : 'POST';
        const body = {
            nome: nome,
            foto_url: fotoUrl || 'assets/images/dashboard_imgs/avatar-default.png',
            ano_participacao: parseInt(ano)
        };
        
        if (id) {
            body.id = parseInt(id);
        }
        
        const response = await fetch('../api/voluntarios.php', {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        const result = await response.json();
        
        if (result.success) {
            mostrarMensagem('Voluntário salvo com sucesso!', 'success');
            fecharModal();
            carregarVoluntarios();
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('Erro ao salvar voluntário:', error);
        mostrarMensagem('Erro ao salvar voluntário: ' + error.message, 'error');
    }
}

// Remover voluntários selecionados
async function removerSelecionados() {
    if (voluntariosSelecionados.length === 0) return;
    
    if (!confirm(`Deseja realmente remover ${voluntariosSelecionados.length} voluntário(s)?`)) {
        return;
    }
    
    try {
        const response = await fetch('../api/voluntarios.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ids: voluntariosSelecionados })
        });
        
        const result = await response.json();
        
        if (result.success) {
            mostrarMensagem(`${result.deleted} voluntário(s) removido(s) com sucesso!`, 'success');
            voluntariosSelecionados = [];
            carregarVoluntarios();
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('Erro ao remover voluntários:', error);
        mostrarMensagem('Erro ao remover voluntários', 'error');
    }
}

// Exportar CSV
function exportarCSV() {
    window.location.href = '../api/voluntarios-csv.php?action=export';
    mostrarMensagem('Exportação iniciada!', 'success');
}

// Importar CSV
function importarCSV() {
    document.getElementById('inputCSV').click();
}

// Processar importação
async function processarImportacao() {
    const input = document.getElementById('inputCSV');
    const file = input.files[0];
    
    if (!file) return;
    
    const formData = new FormData();
    formData.append('csv', file);
    
    try {
        const response = await fetch('../api/voluntarios-csv.php?action=import', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            let mensagem = result.message;
            if (result.errors && result.errors.length > 0) {
                mensagem += '\n\nErros:\n' + result.errors.join('\n');
            }
            alert(mensagem);
            carregarVoluntarios();
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('Erro ao importar CSV:', error);
        mostrarMensagem('Erro ao importar CSV: ' + error.message, 'error');
    }
    
    // Limpar input
    input.value = '';
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
    carregarVoluntarios();
});
