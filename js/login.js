document.getElementById("login").addEventListener("submit", function(event) {
    event.preventDefault(); // Impede o recarregamento da página

    const User = document.getElementById("usuario").value.trim();
    const password = document.getElementById("senha").value.trim();

    // Lógica de autenticação
    if (User === "MsSis" && password === "MS2025@") {
        setTimeout(() => {
            window.location.href = "sis_mercados.html";
        }, 1000);
    } 
    else if (User === "MsAdm" && password === "MS2025@") {
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1000);
    } 
    else {
        alert("Usuário ou senha incorretos!");
    }
});