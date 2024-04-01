const sidebar = document.getElementById('sidebar');

sidebar.addEventListener('mouseenter', function() {
    this.style.width = '200px';
});

sidebar.addEventListener('mouseleave', function() {
    this.style.width = '75px';
});




const logo = document.getElementById("chat-logo");
const modal = document.getElementById("myModal");

// При нажатии на логотип
logo.onclick = function() {
    // Отобразить модальное окно
    modal.style.display = "block";
}

// Найти элемент для закрытия модального окна
const closeBtn = document.getElementsByClassName("close")[0];

// При нажатии на кнопку закрытия
closeBtn.onclick = function() {
    // Скрыть модальное окно
    modal.style.display = "none";
}