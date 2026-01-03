// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";
import { getDatabase, set,ref,push,get,onValue,remove } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

// Referência da coleção de pastas
const foldersRef = ref(db, "folders");

// Seletores
const form = document.getElementById("form");
const folderName = document.getElementById("folderName");
const foldersContainer = document.getElementById("foldersContainer");
const empty = document.getElementById("empty");

// Criar nova pasta
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = folderName.value.trim();
  if (!name) return;

  const newFolderRef = push(foldersRef);

  await set(newFolderRef, {
    name,
    createdAt: new Date().toISOString(),
  });

  folderName.value = "";
});

// Listar e permitir clique
onValue(foldersRef, (snapshot) => {
  foldersContainer.innerHTML = "";
  const data = snapshot.val();

  if (!data) {
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";

  // Ordenar da mais recente para a mais antiga
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

    // 🔹 ABRIR PASTA – corrigido e 100% confiável
    el.querySelector(".open").addEventListener("click", () => {
  if (!id || !folder.name) {
    alert("Erro ao abrir a pasta! Tente novamente.");
    return;
  }

 const url = `sistema?folderID=${encodeURIComponent(id)}&folderName=${encodeURIComponent(folder.name)}`;
window.location.href = url;

});

    // 🔹 APAGAR PASTA
    el.querySelector(".delete").addEventListener("click", async () => {
      if (confirm("Deseja apagar esta pasta?")) {
        await remove(ref(db, "folders/" + id));
      }
    });

    foldersContainer.appendChild(el);
  });
});
