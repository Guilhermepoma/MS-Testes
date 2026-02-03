 const btnMenu = document.getElementById("btnMenu");
  const btnCloseMenu = document.getElementById("close");
  const sidebar = document.getElementById("side-wrapper");
  const overlay = document.getElementById("overlay");

  if (btnMenu) {
    btnMenu.addEventListener("click", () => {
      sidebar.classList.add("active");
      overlay.classList.add("active");
    });
  }

  if (btnCloseMenu) {
    btnCloseMenu.addEventListener("click", () => {
      sidebar.classList.remove("active");
      overlay.classList.remove("active");
    });
  }
  