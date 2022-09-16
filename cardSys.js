const cards = document.querySelectorAll(".lesson-card");
const hiddeContentLessons = () => {
    document.querySelectorAll('.lesson-content').forEach((lesson) => {
        lesson.style.display = 'none';
    });
}

hiddeContentLessons();
cards.forEach((card) =>{
    card.addEventListener("click", (e) => {
        
        hiddeContentLessons()

        const idContentToTp = card.id.split('-')[0]+ "-content"
        const contentLesson = document.getElementById(idContentToTp);
        contentLesson.style.display = "block";

        location.replace('.' +location.pathname + "#" + idContentToTp);
    })
})