listeEl = document.querySelector('nav ul > li')
userSettingsBtn = listeEl.querySelector('img');
listeEl.addEventListener('click', () => {
    listeEl.classList.toggle('grow-anim');
})
userSettingsBtn.addEventListener('click', () => {
    listeEl.classList.toggle('grow-anim');
})

listeEl.addEventListener('animationend', () => {
    console.log('harra')
    document.location.href = '/user';
})