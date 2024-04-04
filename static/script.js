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

// Предположим, что у вас есть переменная isAuthenticated, которая определяет, авторизован ли пользователь
// let isAuthenticated = false;
//
// if (isAuthenticated) {
//     document.querySelector('.login-button').classList.add('hidden');
//     document.querySelector('.logout-button').classList.remove('hidden');
// } else {
//     document.querySelector('.login-button').classList.remove('hidden');
//     document.querySelector('.logout-button').classList.add('hidden');
// }


document.addEventListener("DOMContentLoaded", function() {
    const tournamentsIcon = document.getElementById("tournaments-icon");
    const tournamentsList = document.getElementById("tournaments-list");
    const mainContent = document.querySelector(".main-page");
    const pageLogo = document.querySelector(".page-logo");

    tournamentsIcon.addEventListener("click", function() {
        tournamentsList.style.display = "flex";
        mainContent.style.display = "none";
    });

    pageLogo.addEventListener("click", function() {
        tournamentsList.style.display = "none";
        mainContent.style.display = "flex";
    });
});

