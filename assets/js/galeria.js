/**
 * JavaScript para Página Galeria
 * Dashboard MS
 */

let imagensSelecionadas = [];
let categorias = [];

// Carregar galeria
async function carregarGaleria() {
    try {
        const response = await fetch('../api/galeria.php');
        const result = await response.json();
        
        if (result.success) {
            categorias = result.data.categorias;
            renderizarGaleria(result.data.galeria_agrupada);
            atualizarSelectCategorias();
        } else {
            console.error('Erro ao carregar galeria:', result.message);
            mostrarMensagem('Erro ao carregar galeria', 'error');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        mostrarMensagem('Erro de conexão', 'error');
    }
}

// Renderizar galeria agrupada por categoria
function renderizarGaleria(galeriaAgrupada) {
    const container = document.getElementById('galeriaContainer');
    container.innerHTML = '';
    
    if (Object.keys(galeriaAgrupada).length === 0) {
        container.innerHTML = '<p class="text-center" style="color: var(--text-secondary); padding: 40px;">Nenhuma imagem na galeria. Clique em "Adicionar" para começar.</p>';
        return;
    }
    
    for (const [categoria, imagens] of Object.entries(galeriaAgrupada)) {
        const section = document.createElement('div');
        section.className = 'gallery-section';
        
        section.innerHTML = `
            <div class="gallery-header">
                <h2>${categoria}</h2>
            </div>
            <div class="gallery-grid" id="gallery-${categoria}">
                ${imagens.map(img => criarItemGaleria(img)).join('')}
            </div>
        `;
        
        container.appendChild(section);
    }
    
    atualizarBotaoRemover();
}

// Criar item de galeria
function criarItemGaleria(imagem) {
    return `
        <div class="gallery-item">
            <input type="checkbox" 
                   class="gallery-item-checkbox" 
                   value="${imagem.id}"
                   onchange="toggleSelecao(${imagem.id})">
            <img src="../${imagem.url_imagem}" 
                 alt="Imagem ${imagem.id}"
                 onerror="this.src='../assets/images/dashboard_imgs/placeholder.jpg'">
            <div class="gallery-item-overlay">
                <button class="btn btn-danger" onclick="removerImagem(${imagem.id})">
                    Remover
                </button>
            </div>
        </div>
    `;
}

// Toggle seleção de imagem
function toggleSelecao(id) {
    const index = imagensSelecionadas.indexOf(id);
    if (index > -1) {
        imagensSelecionadas.splice(index, 1);
    } else {
        imagensSelecionadas.push(id);
    }
    atualizarBotaoRemover();
}

// Atualizar visibilidade do botão remover
function atualizarBotaoRemover() {
    const btnRemover = document.getElementById('btnRemover');
    if (imagensSelecionadas.length > 0) {
        btnRemover.style.display = 'block';
        btnRemover.textContent = `Remover Selecionadas (${imagensSelecionadas.length})`;
    } else {
        btnRemover.style.display = 'none';
    }
}

// Atualizar select de categorias
function atualizarSelectCategorias() {
    const select = document.getElementById('selectCategoria');
    select.innerHTML = '<option value="">Selecione uma categoria</option>';
    
    categorias.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        select.appendChild(option);
    });
}

// Abrir modal adicionar
function abrirModalAdicionar() {
    document.getElementById('modalAdicionar').classList.add('active');
}

// Fechar modal
function fecharModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    if (modalId === 'modalAdicionar') {
        document.getElementById('formAdicionar').reset();
    }
}

// Adicionar imagem
async function adicionarImagem(event) {
    event.preventDefault();
    
    const inputImagem = document.getElementById('inputImagem');
    const selectCategoria = document.getElementById('selectCategoria');
    const inputNovaCategoria = document.getElementById('inputNovaCategoria');
    
    // Determinar categoria
    let categoria = selectCategoria.value;
    if (inputNovaCategoria.value.trim()) {
        categoria = inputNovaCategoria.value.trim();
    }
    
    if (!categoria) {
        mostrarMensagem('Selecione ou crie uma categoria', 'error');
        return;
    }
    
    // Upload da imagem
    const formData = new FormData();
    formData.append('imagem', inputImagem.files[0]);
    
    try {
        // Upload do arquivo
        const uploadResponse = await fetch('../api/upload.php', {
            method: 'POST',
            body: formData
        });
        const uploadResult = await uploadResponse.json();
        
        if (!uploadResult.success) {
            throw new Error(uploadResult.message);
        }
        
        // Adicionar ao banco de dados
        const addResponse = await fetch('../api/galeria.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url_imagem: uploadResult.url,
                categoria: categoria
            })
        });
        const addResult = await addResponse.json();
        
        if (addResult.success) {
            mostrarMensagem('Imagem adicionada com sucesso!', 'success');
            fecharModal('modalAdicionar');
            carregarGaleria();
        } else {
            throw new Error(addResult.message);
        }
    } catch (error) {
        console.error('Erro ao adicionar imagem:', error);
        mostrarMensagem('Erro ao adicionar imagem: ' + error.message, 'error');
    }
}

// Remover imagem individual
async function removerImagem(id) {
    if (!confirm('Deseja realmente remover esta imagem?')) {
        return;
    }
    
    try {
        const response = await fetch('../api/galeria.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ids: [id] })
        });
        const result = await response.json();
        
        if (result.success) {
            mostrarMensagem('Imagem removida com sucesso!', 'success');
            carregarGaleria();
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('Erro ao remover imagem:', error);
        mostrarMensagem('Erro ao remover imagem', 'error');
    }
}

// Remover imagens selecionadas
async function removerSelecionadas() {
    if (imagensSelecionadas.length === 0) {
        return;
    }
    
    if (!confirm(`Deseja realmente remover ${imagensSelecionadas.length} imagem(ns)?`)) {
        return;
    }
    
    try {
        const response = await fetch('../api/galeria.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ids: imagensSelecionadas })
        });
        const result = await response.json();
        
        if (result.success) {
            mostrarMensagem(`${result.deleted} imagem(ns) removida(s) com sucesso!`, 'success');
            imagensSelecionadas = [];
            carregarGaleria();
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('Erro ao remover imagens:', error);
        mostrarMensagem('Erro ao remover imagens', 'error');
    }
}

// Mostrar mensagem (temporária)
function mostrarMensagem(texto, tipo) {
    // Criar elemento de mensagem
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
    
    // Remover após 3 segundos
    setTimeout(() => {
        msg.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => msg.remove(), 300);
    }, 3000);
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
}

// Inicializar ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    carregarGaleria();
});
