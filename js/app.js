document.addEventListener("DOMContentLoaded", () => {
    //Cargar la lista de usuarios por defecto al iniciar
    loadHome();
})
//Cargar la lista principal
function loadHome() {
    const appContent = document.getElementById("app-content");
    appContent.className = "users-list";
    appContent.innerHTML = "<p>Cargando usuarios...</p>";
    fetch("index.py?action=users")
        .then(response => response.text())
        .then(html => {
            appContent.innerHTML = html;
        })
        .catch(err => console.error("Error cargando usuarios", err));
}
//Cargar un perfil específico sin salir de la página
function loadProfile(ci) {
    const appContent = document.getElementById("app-content");
    appContent.className = "";
    appContent.innerHTML = "<p>Cargando perfil...</p>";
    fetch(`index.py?action=profile&ci=${ci}`)
        .then(response => response.text())
        .then(html => {
            appContent.innerHTML = html;
        })
        .catch(err => console.error("Error cargando perfil", err));
}
//Menu Movil
(function mobileMenu() {
    const menuIcon = document.querySelector(".menu-icon")
    const navBarList = document.getElementById("navBarList")
    if (menuIcon && navBarList) {
        menuIcon.addEventListener("click", () => {
            navBarList.classList.toggle("menu-active")
        })
    }
})();
// Barra de Búsqueda
(function searchCoord() {
    const searchBarFrame = document.getElementById("searchBar");
    if (!searchBarFrame) return;
    const searchBarInput = searchBarFrame.querySelector("input");
    const searchBarButton = searchBarFrame.querySelector("button");
    function search() {
        const value = searchBarInput.value.toLowerCase();
        const cards = document.querySelectorAll(".user-card");
        const appContent = document.getElementById("app-content");
        if (appContent.className !== "users-list") {
            loadHome();
            setTimeout(search, 200);
            return;
        }
        let found = false;
        cards.forEach(card => {
            const name = card.querySelector("h4").innerText.toLowerCase();
            if (name.includes(value)) {
                card.style.display = "block";
                found = true;
            } else {
                card.style.display = "none";
            }
        });
        const searchFail = document.getElementById("searchFail");
        const searchFailResult = document.getElementById("searchFailResult");
        if (searchFail && searchFailResult) {
            if (!found) {
                searchFail.classList.remove("hidden");
                searchFailResult.innerText = value;
            } else {
                searchFail.classList.add("hidden");
            }
        }
    }

    searchBarButton.addEventListener("click", search);
    searchBarInput.addEventListener("keyup", search);
})();

