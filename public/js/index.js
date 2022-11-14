const nav = document.getElementById('menu-nav');

const balisesDiv = document.querySelectorAll('span.div');
balisesDiv.forEach((div) => {
    if (div.textContent.length > 0){
        div.textContent = "<div> "+ div.textContent +" </div>";
    }else{
        div.textContent = "<div> ... </div>";
    }
});
const balisesInput = document.querySelectorAll('span.input');
balisesInput.forEach((input) => {
    input.textContent += "<input/>";
})
const balisesHtml = document.querySelectorAll('span.html');
balisesHtml.forEach((html) => {
    if (html.textContent.length > 0){
        html.textContent = "<html> "+ html.textContent +" </html>";
    }else{
        html.textContent = "<html> ... </html>";
    }
})
const balisesH1 = document.querySelectorAll('span.h1');
balisesH1.forEach((h1) => {
    if (h1.textContent.length > 0){
        h1.textContent = "<html> "+ h1.textContent +" </html>";
    }else{
        h1.textContent = "<html> ... </html>";
    }
})
const balisesBody = document.querySelectorAll('span.body');
balisesBody.forEach((body) => {
    if (body.textContent.length > 0){
        body.textContent = "<body> "+ body.textContent +" </body>";
    }else{
        body.textContent = "<body> ... </body>";
    }
})
const paths = [
    {path:"../cours", name :"Cours"},
    {path:"../forum", name :"Forum"},
    {path:"../market", name :"Market"},
    {path:"../projet", name :"Projet"},
]
let toAddOnNav = `<ul id="nav-bar">`;
paths.forEach((obj)=>{
    if(!obj.path.includes(location.pathname) || location.pathname ==='/'){
        toAddOnNav += `<li><a href="${obj.path}">${obj.name}</a></li>`;
    }else{
        toAddOnNav += `<li><a href="./">Acceuil</a></li>`;
    }
});
toAddOnNav +="</ul>";
nav.innerHTML = toAddOnNav;