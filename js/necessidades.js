import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";
import {  getDatabase, 
  set,
  ref,
  push,
  get,
  onValue,
  remove
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener("DOMContentLoaded", () => {

  const params = new URLSearchParams(window.location.search);
  const idInstituicao = params.get("id");
  const nomeInstituicao = params.get("nome");

  if (!idInstituicao) {
    document.body.innerHTML = `
      <h2>Instituição não selecionada</h2>
      <a href="Triagem.html">Voltar</a>
    `;
    return;
  }

  document.getElementById("titulo").innerText =
    `Necessidades de: ${nomeInstituicao}`;

  const form = document.getElementById("formNecessidade");
  const produtoInput = document.getElementById("produto");
  const quantidadeInput = document.getElementById("quantidade");
  const lista = document.getElementById("listaNecessidades");

  const necessidadesRef = ref(
    db,
    `instituicoes/${idInstituicao}/necessidades`
  );

  /* =======================
     ADICIONAR NECESSIDADE
  ======================= */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const produto = produtoInput.value.trim().toLowerCase();
    const quantidade = parseInt(quantidadeInput.value);

    if (!produto || quantidade <= 0) {
      alert("Preencha corretamente!");
      return;
    }

    await push(necessidadesRef, {
      produto,
      quantidade
    });

    form.reset();
  });

  /* =======================
     LISTAR NECESSIDADES
  ======================= */
  onValue(necessidadesRef, (snapshot) => {
    lista.innerHTML = "";

    if (!snapshot.exists()) {
      lista.innerHTML =
        `<tr><td colspan="3">Nenhuma necessidade pendente</td></tr>`;
      return;
    }

    Object.entries(snapshot.val()).forEach(([id, item]) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${item.produto}</td>
        <td>${item.quantidade}</td>
        <td><button>Excluir</button></td>
      `;

      tr.querySelector("button").addEventListener("click", () => {
        remove(
          ref(db, `instituicoes/${idInstituicao}/necessidades/${id}`)
        );
      });

      lista.appendChild(tr);
    });
  });

});