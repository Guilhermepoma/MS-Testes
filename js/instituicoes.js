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
const analytics = getAnalytics(app);
const db = getDatabase(app);

// ELEMENTOS
const form = document.getElementById("formInstituicao")
const nomeInput = document.getElementById("nomeInstituicao")
const lista = document.getElementById("listaInstituicoes")

const instituicoesRef = ref(db,"instituicoes");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nome = nomeInput.value.trim();

  if (!nome) {
    alert("Preencha todos os campos!");
    return;
  }

  await push(instituicoesRef, {
    nome,
  });

  form.reset();
});

// === LISTAR ===
onValue(instituicoesRef, (snapshot) => {
  lista.innerHTML = "";

  if (!snapshot.exists()) {
    lista.innerHTML = `<tr><td colspan="4">Nenhuma instituição cadastrada</td></tr>`;
    return;
  }

  const dados = snapshot.val();

  Object.entries(dados).forEach(([id, inst]) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${inst.nome}</td>
      <td>
          <button type ="button" class="btndistribuicao">Triagem</button>
          <button type ="button" class="btnNecessidades">Necessidades</button>
          <button type ="button" data-id="${id}" class="btnExcluir">Excluir</button>
      </td>
    `;
    tr.querySelector(".btndistribuicao").addEventListener("click", () => {
      window.location.href = `../private/distribuicao?id=${id}&nome=${encodeURIComponent(inst.nome)}`;
      });
    tr.querySelector(".btnNecessidades").addEventListener("click", () => {
      window.location.href = `../private/necessidades?id=${id}&nome=${encodeURIComponent(inst.nome)}`;
      });

    tr.querySelector(".btnExcluir").addEventListener("click", () => {
      if (confirm("Deseja excluir esta instituição?")) {
        remove(ref(db, "instituicoes/" + id));
      }
    
    });

    lista.appendChild(tr);
  });

});
