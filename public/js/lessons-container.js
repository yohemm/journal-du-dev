const allCards = document.querySelectorAll('#lessons-container .card-lesson, #cursus-container .card-cursus');
console.log(allCards);

const form = document.querySelector('#container-lessons-filter')
const filterLessonCour = form.querySelector('#cours-lessons');
const filterLang = form.querySelector('#prog-lang')
const courContainer = document.querySelector('#lessons-container');
const formationContainer = document.querySelector('#cursus-container');

window.addEventListener('load', (event) => {
  console.log(formationContainer); 
  formationContainer.classList.toggle("hide");
})
filterLessonCour.addEventListener("change", (event) =>{
  formationContainer.classList.toggle("hide");
  courContainer.classList.toggle("hide");
});
filterLang.addEventListener("change", (event) =>{
  for(const card of allCards){
    console.log(card); 
  }
})