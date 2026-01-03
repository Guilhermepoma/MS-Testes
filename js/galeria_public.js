/**
 * JavaScript para a página pública de Galeria (galeria.html)
 * Carrega dados da API e renderiza as imagens.
 */

// Função para carregar dados da API
async function carregarDadosGaleria() {
    try {
        const response = await fetch('api/galeria.php');
        const result = await response.json();

        if (result.success) {
            // A API já retorna dados agrupados em galeria_agrupada
            renderizarGaleria(result.data.galeria_agrupada);
        } else {
            console.error('Erro ao carregar dados da galeria:', result.message);
        }
    } catch (error) {
        console.error('Erro na requisição da galeria:', error);
    }
}

// Renderiza a galeria agrupada por categoria
function renderizarGaleria(galeriaAgrupada) {
    const galeriaWrapper = document.querySelector('.galeria-wrapper');
    galeriaWrapper.innerHTML = ''; // Limpa o conteúdo estático

    if (Object.keys(galeriaAgrupada).length === 0) {
        galeriaWrapper.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">Nenhuma imagem disponível no momento.</p>';
        return;
    }

    // Renderizar cada seção de categoria
    for (const categoria in galeriaAgrupada) {
        const imagens = galeriaAgrupada[categoria];

        const section = document.createElement('div');
        section.classList.add('galeria-section');
        section.innerHTML = `
            <h3>${categoria}</h3>
            <div class="galeria-grid">
                ${imagens.map(item => `
                    <div class="galeria-item" onclick="openModal('${item.url_imagem}')">
                        <img src="${item.url_imagem}" alt="Imagem da Galeria ${categoria}" 
                             onerror="this.onerror=null; this.src='assets/images/dashboard_imgs/placeholder1.jpg'">
                        <div class="galeria-overlay">
                            <span class="galeria-title">${categoria}</span>
                            <span class="galeria-desc">Adicionada em ${new Date(item.data_upload).toLocaleDateString('pt-BR')}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        galeriaWrapper.appendChild(section);
    }
}

// Funções do Modal (mantidas do arquivo original)
function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    modal.style.display = 'flex';
    modalImage.src = imageSrc;
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Inicializa o carregamento dos dados
document.addEventListener('DOMContentLoaded', carregarDadosGaleria);
