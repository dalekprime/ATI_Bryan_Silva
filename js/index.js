//Global data Management
const urlParams = new URLSearchParams(window.location.search)
const ciURl = urlParams.get("ci")
let langURl = urlParams.get("lang")
langURl = langURl? langURl: "ES"
const searchURL = urlParams.get("search");

(function loadLang(lang){
    const script = document.createElement("script")
    script.src = `./conf/config${lang}.json`
    script.onload = function() {
        language(config)
        if (!searchURL) {
            users(profiles)
        }
    }
    document.body.appendChild(script)
})(langURl);

(function mobileMenu() {
    const menuIcon = document.querySelector(".menu-icon");
    const navBarList = document.getElementById("navBarList");
    menuIcon.addEventListener("click", () => {
        navBarList.classList.toggle("menu-active");
    });
})();

function language(configData){
    //Limpieza de Datos
    const cleanData = { 
        ...configData, 
        email: configData.email ? configData.email.slice(0, -8) : "" 
    }
    //NavBar
    const navBarList = document.getElementById("navBarList")
    if(navBarList){
        //Logo UCV
        const siteLogo = navBarList.querySelector("li:first-child a")
        siteLogo.childNodes.forEach((node, index) => {
            node.nodeValue = cleanData.site[index]
            if(node.nodeType == 1){
                node.innerText = cleanData.site[index]
            }
        })
        //Barra de Busqueda
        const searchButton = navBarList.querySelector("li:nth-child(3) div")
        searchButton.children[0].setAttribute("placeholder", `${cleanData.name}...`)
        searchButton.children[1].innerText = cleanData.search
    }
    //Traduccion Generica
    const attris = document.querySelectorAll("[data-key]")
    attris.forEach(node => {
        const key = node.dataset.key
        const dataValue = cleanData[key]
        const finalDataValue = Array.isArray(dataValue)? dataValue[0]: dataValue
        if(node.parentNode.id === "attris" || key === "email"){
            node.innerText = `${finalDataValue}:`
        }else{
            node.innerText = finalDataValue
        }
    })
};

function users(profileList){
    const userList = document.getElementById("userList")
    const fragment = document.createDocumentFragment()
    profileList.forEach(profile => {
        const card = document.createElement("div")
        card.className = "user-card"
        card.innerHTML = 
            `<img class="img-big" src="${profile.ci}/${profile.ci}Big${profile.image_ext}">
            <img class="img-small" src="${profile.ci}/${profile.ci}Small${profile.image_ext}">
            <h4>${profile.name}</h4>`
        card.addEventListener("click", () => {
            window.location.href = `profile.html?ci=${profile.ci}`
        })
        fragment.appendChild(card)
    })
    userList.appendChild(fragment)
};

//Search Bar
(function searchCoord(){
    const searchBarFrame = document.getElementById("searchBar")
    const searchBarInput = searchBarFrame.querySelector("input")
    const searchBarButton = searchBarFrame.querySelector("button")
    function search(){
        const userList = document.getElementById("userList")
        userList.innerHTML = ""
        const value = searchBarInput.value.toLowerCase()
        const newProfiles = profiles.filter(profile => {
            const nameProfile = profile.name.toLowerCase()
            return nameProfile.includes(value)
        })
        users(newProfiles)
        const searchFail = document.getElementById("searchFail")
        const searchFailResult = document.getElementById("searchFailResult")
        if(!newProfiles.length){
            searchFail.classList.remove("hidden")
            searchFailResult.innerText = value
        }else{
            searchFail.classList.add("hidden")
        }
    }
    searchBarButton.addEventListener("click", search)
    searchBarInput.addEventListener("keyup", search)
    if(searchURL){
        searchBarInput.value = searchURL
        search()
    }
})();