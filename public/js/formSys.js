const inputs = document.querySelectorAll('input');
const tareas = document.querySelectorAll('textarea');


document.addEventListener('DOMContentLoaded', (e) => {
  console.log('lmskfjqdpoimjqd<lfkjqls<!kdjfmlkqsjdmflkjqsmldkfjml');
  inputs.forEach(input => {
    if(input.value != ""){
      console.log('malkjre')
      input.parentNode.classList.add('animation');
    }else if(input.value == ""){
      input.parentNode.classList.remove('animation');
    }
  })
  tareas.forEach(tarea => {
    if(tarea.value != ""){
      console.log('malkjre')
      tarea.parentNode.classList.add('animation');
    }else if(tarea.value == ""){
      tarea.parentNode.classList.remove('animation');
    }
  })
})
for (let i = 0; i < inputs.length; i++){
  let field = inputs[i];
  field.addEventListener('input', (e) => {
    if(e.target.value != ""){
      e.target.parentNode.classList.add('animation');
    }else if(e.target.value == ""){
      e.target.parentNode.classList.remove('animation');
    }
  })
}