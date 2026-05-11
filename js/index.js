(function language(configData){
    //Limpieza de Datos
    const cleanData = { 
        ...configData, 
        email: configData.email ? configData.email.slice(0, -8) : "" 
    };

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
        const key = node.dataset.key;
        const dataValue = cleanData[key]
        //Esta linea se debe alterar cuando se cargue la data
        const finalDataValue = Array.isArray(dataValue)? dataValue[0]: dataValue;
        if(node.parentNode.id === "attris" || key === "email"){
            node.innerText = `${finalDataValue}:`
        }else{
            node.innerText = finalDataValue
        }
    })
})(config);

(function users(profileList){
    const userList = document.getElementById("userList")
    const fragment = document.createDocumentFragment()
    profileList.forEach(profile => {
        const card = document.createElement("div");
        card.className = "user-card";
        card.innerHTML = 
            `<img class="img-big" src="${profile.ci}/${profile.ci}Big${profile.image_ext}">
            <img class="img-small" src="${profile.ci}/${profile.ci}Small${profile.image_ext}">
            <h4>${profile.name}</h4>`
        card.addEventListener("click", () => {
            window.location.href = `profile.html?ci=${profile.ci}`;
        });
        fragment.appendChild(card);
    });
    userList.appendChild(fragment);
})(profiles);
