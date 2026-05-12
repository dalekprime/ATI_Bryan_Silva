//Global data Management
const urlParams = new URLSearchParams(window.location.search)
const ciURl = urlParams.get("ci")
let langURl = urlParams.get("lang")
langURl = langURl? langURl: "ES";

(function loadLang(lang){
    const script = document.createElement("script")
    script.src = `./conf/config${lang}.json`
    script.onload = function() {
        language(config)
        if(ciURl){
            loadData(ciURl)
        }
    }
    document.body.appendChild(script)
})(langURl)

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
        const searchButton = navBarList.querySelector("li:nth-child(2) div")
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

function loadData(ciParam){
    const script = document.createElement("script")
    script.src = `./${ciParam}/profile.json`
    script.onload = function() {
    if(profile){
        profileData(profile)
    }}
    document.body.appendChild(script)
}

function profileData(profileInfoList){
    const profileCard = document.getElementById("profileCard")
    const profileInfo = profileCard.querySelectorAll("[data-profile]")
    profileInfo.forEach(prop => {
        const key = prop.dataset.profile
        const dataValue = profileInfoList[key]
        prop.innerText = Array.isArray(dataValue) ? dataValue.join(", ") : dataValue
        if(Array.isArray(dataValue) && dataValue.length > 1){
            const element = document.querySelector(`[data-key="${key}"]`)
            if(key != "language") element.innerText = config[key][1]
        }
    })
    const profileImg = document.getElementById("profile-img")
    profileImg.innerHTML = 
            `<img class="img-big" src="${profileInfoList.ci}/${profileInfoList.ci}Big${profileInfoList.image_ext}">
            <img class="img-small" src="${profileInfoList.ci}/${profileInfoList.ci}Small${profileInfoList.image_ext}">`
};

//Search Redirect
(function externalSearch(){
    const searchBarFrame = document.getElementById("searchBar")
    const searchBarInput = searchBarFrame.querySelector("input")
    const searchBarButton = searchBarFrame.querySelector("button")
    function redirect() {
        const value = searchBarInput.value.trim()
        if(value){
            window.location.href = `index.html?search=${encodeURIComponent(value)}`
        }
    }
    searchBarButton.addEventListener("click", redirect)
    searchBarInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter") redirect()
    })
})();