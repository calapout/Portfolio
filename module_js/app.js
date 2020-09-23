/************************************** uncheck du menu ***************************************************/
document.querySelector('#BurgerCheckbox').checked = false;

/************************************** loading async des images ***************************************************/
let imgs = document.querySelectorAll("img");
imgs.forEach(image => {
    image.decoding = 'async';
})

/************************************** loading async du CSS ***************************************************/
loadJSON("./module_js/css.json", RenderCssOnLoad);

/**
 * @summary Génère les link permettant de récupérer le CSS à afficher
 * @param {Object} json L'object JSON récupérer plus haut
 */
function RenderCssOnLoad(json){
    for(let i = 0; i < json.length; i++){
        let myCSS = document.createElement( "link" );
        myCSS.rel = "stylesheet";
        myCSS.href = json[i].href;
        if(json[i].crossorigin != "")myCSS.crossOrigin = json[i].crossorigin;
        if(json[i].integrity != "")myCSS.integrity = json[i].integrity;
    
        document.head.insertBefore( myCSS, document.head.childNodes[ document.head.childNodes.length - 1 ].nextSibling )
    }
}

/************************************** Gestion du playable ***************************************************/

/**
 * @summary Fonction qui rend les div cliquable lorsque l'on est sur ordinateur
 */
function makeItPlayable(){
    let playables = document.querySelectorAll("div.playable");
    const isMobile = window.mobileAndTabletcheck();

    if(isMobile){
        document.querySelector("#messageMobile").style.display = "block";
        document.querySelector("#messageMobile").style.padding = "0.3em";
        return;
    }

    playables.forEach(element => {
        element.addEventListener("click", OnClickPlayable, false);
    });
   
}

/**
 * @summary Fonction qui gère les event de type click sur les div jouable
 * @param {Object} event L'évênement qui appel la fonction
 */
function OnClickPlayable(event){
    let tempTarget = GetParentDiv(event.target);
    window.open(tempTarget.dataset.url, '_blank');
}

/**
 * @summary Fonction qui remonte la hiérarchie jusqu'au Div parent
 * @param {Object} child L'enfant qui sert de référence
 * @returns {Element} tempTarget Le div parent
 */
function GetParentDiv(child){
    let tempTarget = child;
    let IsParentDiv = false;
    while(IsParentDiv == false){
        if(tempTarget.nodeName == "DIV"){
            return tempTarget;
        }
        tempTarget = tempTarget.parentNode;
    }
}


/************************************** Navigation ***************************************************/
let navigationButtons = document.querySelectorAll(".navigation>a");
for(let i = 0; i< navigationButtons.length; i++){
    navigationButtons[i].addEventListener("click", ()=>{
        document.querySelector('#BurgerCheckbox').checked = false;
    });
}

/************************************** Wrapper ***************************************************/
/**
 * @summary fonction qui va assigner le nombre de rangé selon le nombre d'image diviser par le nombre d'image maximux par colonne définie par la taille de l'appareil;
 */
function wrappIt(){
    let wrappers = document.querySelectorAll(".wrapper");

    const tabletWidth = 768;
    const wideWidth = 1200;
    const colNbMobile = 1;
    const colNbTablet = 2;
    const colNbWide = 3;

    let width = window.innerWidth;
    if(width > tabletWidth){
        assignRowByColumn(colNbWide, wrappers);
    }
    else if(width > wideWidth){
        assignRowByColumn(colNbTablet, wrappers);
    }
    else{
        assignRowByColumn(colNbMobile, wrappers);
    }

    window.addEventListener('resize', ()=>{
        let width = window.innerWidth
        if(width > wideWidth){
            assignRowByColumn(colNbWide, wrappers);
            makeItPlayable();
        }
        else if(width > tabletWidth){
            assignRowByColumn(colNbTablet, wrappers);
            makeItPlayable();
        }
        else{
            assignRowByColumn(colNbMobile, wrappers);
            makeItPlayable();
        }
    })
}

/**
 * 
 * @param {*} colNumber Quantité de colonnes à afficher
 * @param {*} wrappers Objet du DOM qui gère la quantité de colonnes par ligne. Utiliser pour l'assignation du nombre de rangée
 */
function assignRowByColumn(colNumber, wrappers){
    for(let i = 0; i < wrappers.length; i++){
        wrappers[i].style.gridTemplateRows = "repeat(" + Math.ceil(wrappers[i].childElementCount/colNumber) + ", 1.3fr)";
        //calc(width * (calc(16/9)))
    }
}

/************************************** génération des div ***************************************************/
//Ligne qui permet de récupérer les image à afficher
loadJSON("./module_js/projets.json", renderOnLoaded);


/**
 * @summary Fonction permettant d'afficher les images selon l'objet JSON passer en paramêtre
 * @param {aProject} aProject fichier contenant tous les projets à faire apparaitre dans la page
 */
function renderOnLoaded(aProject){
    for(let i = 0; i < aProject.length; i++){
        let wrapper = document.querySelector('#'+aProject[i].id+">.wrapper");
        for(let y = 0; y < aProject[i].projects.length; y++){

            //création de la div
            let tempsDiv = document.createElement('div');
            if(aProject[i].projects[y].isPlayable == true && !window.mobileAndTabletcheck()){
                tempsDiv.classList.add("playable");
            }
            tempsDiv.dataset.url = aProject[i].projects[y].url;

            //création de la figure
            let figure = document.createElement("figure");

            //création de l'img'
            let img = document.createElement("img");
            img.src = "images/"+aProject[i].projects[y].fileName;
            img.alt = aProject[i].projects[y].alt;
            img.decoding = "async";
            figure.appendChild(img);

            //création de la figcaption
            let figcaption = document.createElement("figcaption");
            figcaption.innerHTML = aProject[i].projects[y].figcaption;
        
            //ajout du figure dans la div
            tempsDiv.appendChild(figure);
            //ajout du figcaption dans la div
            tempsDiv.appendChild(figcaption);

            //ajout dans la page
            wrapper.appendChild(tempsDiv);
        }
    }

    wrappIt();
    makeItPlayable();
}

function loadJSON(url, callback) {   

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', url, true);
        xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(JSON.parse(xobj.responseText));
          }
    };
    xobj.send(null);  
 }