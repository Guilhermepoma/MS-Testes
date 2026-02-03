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

const lista = document.getElementById("listaDistribuicao");
const instituicoesRef = ref(db, "instituicoes");

onValue(instituicoesRef, (snapshot) => {
  lista.innerHTML = "";

  if (!snapshot.exists()) return;

  Object.values(snapshot.val()).forEach(inst => {

    if (!inst.distribuicao) return;

    Object.values(inst.distribuicao).forEach(item => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${inst.nome}</td>
        <td>${item.produto}</td>
        <td>${item.quantidade}</td>
        <td>${item.origem}</td>
        <td>${new Date(item.data).toLocaleString()}</td>
      `;

      lista.appendChild(tr);
    });
  });
});
