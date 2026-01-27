// === Importações Firebase ===
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";
import { 
  getDatabase, 
  set,
  ref,
  push,
  get,
  onValue,
  remove
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

// === Configuração Firebase ===
const firebaseConfig = {
  apiKey: "AIzaSyAVEBqwEfvZ_kwvxI0OPnzNulrOFTnvUsI",
  authDomain: "mercadosolidario-3d61e.firebaseapp.com",
  databaseURL: "https://mercadosolidario-3d61e-default-rtdb.firebaseio.com",
  projectId: "mercadosolidario-3d61e",
  storageBucket: "mercadosolidario-3d61e.firebasestorage.app",
  messagingSenderId: "481630792815",
  appId: "1:481630792815:web:1aa597b7ca16b44daff19a",
  measurementId: "G-B3Z022NPG9"
};

// === Inicializa Firebase ===
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

// === Aguarda DOM carregado ===
document.addEventListener("DOMContentLoaded", () => {

  // ==========================
  // === PÁGINA DE PASTAS ====
  // ==========================
  if (document.getElementById("foldersContainer")) {
    const foldersRef = ref(db, "folders");
    const form = document.getElementById("form");
    const folderNameInput = document.getElementById("folderName");
    const foldersContainer = document.getElementById("foldersContainer");
    const empty = document.getElementById("empty");

    // Criar nova pasta
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = folderNameInput.value.trim();
      if (!name) return;

      const newFolderRef = push(foldersRef);
      await set(newFolderRef, {
        name,
        createdAt: new Date().toISOString(),
      });

      folderNameInput.value = "";
    });

    // Listar pastas
    onValue(foldersRef, (snapshot) => {
      foldersContainer.innerHTML = "";
      const data = snapshot.val();

      if (!data) {
        empty.style.display = "block";
        return;
      }

      empty.style.display = "none";

      const foldersArray = Object.entries(data).sort(
        (a, b) => new Date(b[1].createdAt) - new Date(a[1].createdAt)
      );

      foldersArray.forEach(([id, folder]) => {
        const el = document.createElement("div");
        el.className = "folder";
        el.innerHTML = `
          <div class="folder-name">${folder.name}</div>
          <div class="meta">Criado: ${new Date(folder.createdAt).toLocaleString()}</div>
          <div class="actions">
            <button class="open">Abrir</button>
            <button class="delete">Apagar</button>
          </div>
        `;

        el.querySelector(".open").addEventListener("click", () => {
          window.location.href =
            `sistema.html?folderID=${id}&folderName=${encodeURIComponent(folder.name)}`;
        });

        el.querySelector(".delete").addEventListener("click", () => {
          if (confirm("Deseja apagar esta pasta?")) {
            remove(ref(db, "folders/" + id));
          }
        });

        foldersContainer.appendChild(el);
      });
    });
  }

  // ==========================
  // === PÁGINA DE ESTOQUE ====
  // ==========================
  // 🔥 CORREÇÃO AQUI: antes era getElementById(), agora querySelector()
  if (document.querySelector("#formProduto")) {

    const form = document.getElementById("formProduto");
    const btnBuscar = document.getElementById("btnBuscar");
    const inputBuscar = document.getElementById("buscarCodigo");
    const inputQuantidadeBusca = document.getElementById("quantidadeBusca");
    const resultadoDiv = document.getElementById("resultadoBusca");
    const tabelaEstoque = document.querySelector("#tabelaEstoque tbody");

    const params = new URLSearchParams(window.location.search);
    const folderID = params.get("folderID");
    const folderName = params.get("folderName");

    if (!folderID) {
      alert("Nenhuma pasta selecionada!");
      window.location.href = "index.html";
      return;
    }

    const pastaRef = ref(db, `folders/${folderID}/estoque`);

    // === Função para carregar tabela da pasta ===
    function carregarTabela() {
    onValue(pastaRef, (snapshot) => {
    tabelaEstoque.innerHTML = "";
    const data = snapshot.val();
    if (!data) {

      document.getElementById("totaisEstoque").innerHTML = `
        Total de Quantidade: <b>0</b>
        Total de Peso: <b>0.00 kg</b>
        Total de Preço: <b>R$ 0.00</b>
      `;
      return;
    }

    let totalQtd = 0;
    let totalPeso = 0;
    let totalPreco = 0;

    Object.values(data).forEach((item) => {

      // GARANTE QUE TODOS OS VALORES EXISTEM
      const precoStr = item.preco !== undefined ? item.preco.toString() : "0";
      const pesoStr = item.peso !== undefined ? item.peso.toString() : "0";
      const qtdStr = item.quantidade !== undefined ? item.quantidade.toString() : "0";

      // CONVERTE COM SEGURANÇA
      const precoFloat = parseFloat(precoStr.replace(",", ".")) || 0;
      const pesoFloat = parseFloat(pesoStr.replace(",", ".")) || 0;
      const qtdInt = parseInt(qtdStr) || 0;

      // ACUMULA TOTAIS
      totalQtd += qtdInt;
      totalPeso += pesoFloat * qtdInt;
      totalPreco += precoFloat * qtdInt;

      // LINHA NA TABELA
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${item.codigo || ""}</td>
        <td>${item.nome || ""}</td>
        <td>${item.preco || 0}</td>
        <td>${item.peso || 0}</td>
        <td>${item.quantidade || 0}</td>
      `;
      tabelaEstoque.appendChild(tr);
    });

    // EXIBE OS TOTAIS
    document.getElementById("totaisEstoque").innerHTML = `
      <b>Total de Quantidade: ${totalQtd}</b>
      <b>Total de Peso: <b>${totalPeso.toFixed(2)} kg</b>
      <b>Total de Preço: <b>R$ ${totalPreco.toFixed(2)}</b>
    `;
  });
}


    carregarTabela();

    // === CADASTRAR PRODUTO GLOBAL ===
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const codigo = document.getElementById("codigo").value.trim();
      const nome = document.getElementById("nome").value.trim();
      const preco = document.getElementById("preco").value.trim();
      const peso = document.getElementById("peso").value.trim();

      if (!codigo || !nome || !peso || !preco) {
        alert("Preencha todos os campos!");
        return;
      }

      try {
        const produtosRef = ref(db, "produtos");
        await push(produtosRef, { codigo, nome,peso, preco });
        form.reset();
        alert("✅ Produto cadastrado com sucesso!");
      } catch (error) {
        console.error("Erro ao cadastrar produto:", error);
      }
    });

    // === BUSCAR PRODUTO E ADICIONAR À PASTA ===
    btnBuscar.addEventListener("click", async () => {
      const codigoBusca = inputBuscar.value.trim();
      const qtdBusca = parseInt(inputQuantidadeBusca.value.trim(), 10) || 0;

      if (!codigoBusca) {
        alert("Digite um código para buscar!");
        return;
      }
      if (qtdBusca <= 0) {
        alert("Informe uma quantidade válida!");
        return;
      }

      try {
        const produtosRef = ref(db, "produtos");
        const snapshot = await get(produtosRef);

        if (!snapshot.exists()) {
          resultadoDiv.innerHTML = `<p style="color:red;">Nenhum produto cadastrado.</p>`;
          return;
        }

        const produtos = snapshot.val();
        let encontrado = null;

        for (const key in produtos) {
          if (produtos[key].codigo === codigoBusca) {
            encontrado = produtos[key];
            break;
          }
        }

        if (!encontrado) {
          resultadoDiv.innerHTML = `<p style="color:red;">Produto não encontrado.</p>`;
          return;
        }

        resultadoDiv.innerHTML =
          `<p style="color:green;">Produto encontrado: ${encontrado.nome}</p>`;

        // Atualiza ou adiciona no estoque da pasta
        const snapshotEstoque = await get(pastaRef);
        let estoque = snapshotEstoque.exists() ? snapshotEstoque.val() : {};
        let produtoExistenteKey = null;

        for (const key in estoque) {
          if (estoque[key].codigo === codigoBusca) {
            produtoExistenteKey = key;
            break;
          }
        }

        if (produtoExistenteKey) {
          const novaQtd =
            parseInt(estoque[produtoExistenteKey].quantidade || 0) + qtdBusca;

          await set(ref(db, `folders/${folderID}/estoque/${produtoExistenteKey}`), {
            ...estoque[produtoExistenteKey],
            quantidade: novaQtd
          });

        } else {
          await push(pastaRef, {
            codigo: encontrado.codigo,
            nome: encontrado.nome,
            preco: encontrado.preco,
            peso: encontrado.peso,
            quantidade: qtdBusca
          });
        }

        carregarTabela();

      } catch (error) {
        console.error("Erro ao buscar produto:", error);
        resultadoDiv.innerHTML =
          `<p style="color:red;">Erro ao buscar produto.</p>`;
      }
    });
  }
       function atualizarTotais(){
          const tabela = document.querySelector("#tabelaEstoque tbody");
          const linhas = tabela.querySelector("tr");
          
          let totalQuantidade = 0;
          let totalValor = 0;
        
          linhas.forEach(linha => {
                const preco = parseFloat(linha.children[2].textContent.replace(",","."));
                const qtd = parseInt(linha.children[3].textContent);

                totalQuantidade +=qtd;
                totalValor += preco*qtd;
          })}
});
