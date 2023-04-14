elementList.forEach((element)=>{
    element.classList.add("transition-bg")
})
document.addEventListener("readystatechange", event => {
    if(event.target.readyState == 'complete'){
        elementList.forEach((element)=>{
            element.classList.remove('green')
            console.log(element.style)
        })
    }
    console.log(event.target.readyState)
})