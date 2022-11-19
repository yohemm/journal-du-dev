userSettingsBtns = document.querySelectorAll('nav ul li img');
userSettingsBtns.forEach(userSettingsBtn => {  
    userSettingsBtn.addEventListener('click', () => {
        userSettingsBtns[0].classList.toggle('grow-anim');
    })
});

userSettingsBtns[0].addEventListener('animationend', () => {
    console.log('harra')
    document.location.href = '/user';
})