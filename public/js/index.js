const elementList = document.querySelectorAll('body, main');
const listeEl = document.querySelector('nav ul > li')
const userSettingsBtn = listeEl.querySelector('img');
listeEl.addEventListener('click', () => {
    listeEl.classList.toggle('grow-anim');
})
userSettingsBtn.addEventListener('click', () => {
    listeEl.classList.toggle('grow-anim');
})

listeEl.addEventListener('animationend', () => {
    elementList.forEach((element)=>{
        element.classList.add('green')
    })
    document.location.href = '/user';
})