// Проверяем, существует ли элемент с id "sidebar"
const sidebar = document.getElementById('sidebar');

// Если элемент существует, добавляем обработчики событий
if (sidebar) {
    sidebar.addEventListener('mouseenter', function() {
        this.style.width = '200px';
    });

    sidebar.addEventListener('mouseleave', function() {
        this.style.width = '75px';
    });
}


const logo = document.getElementById("chat-logo");
const modal = document.getElementById("myModal");

if (logo) {
    // При нажатии на логотип
    logo.onclick = function() {
        // Отобразить модальное окно
        modal.style.display = "block";
    }
}


// Найти элемент для закрытия модального окна
const closeBtn = document.getElementsByClassName("close")[0];

if (closeBtn) {
    // При нажатии на кнопку закрытия
    closeBtn.onclick = function() {
        // Скрыть модальное окно
        modal.style.display = "none";
    }
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

    if (tournamentsIcon) {
        tournamentsIcon.addEventListener("click", function() {
            tournamentsList.style.display = "flex";
            mainContent.style.display = "none";
        });

        pageLogo.addEventListener("click", function() {
            tournamentsList.style.display = "none";
            mainContent.style.display = "flex";
        });
    }
});


function addTeam() {
    const tournamentField = document.getElementById('tournament-teams-container');
    const newInput = document.createElement('input');
    newInput.placeholder = "введите название команды";
    newInput.type = 'text';
    newInput.name = 'team';
    newInput.classList.add('tournament-teams');
    newInput.autocomplete = 'off';
    newInput.required = true;

    tournamentField.appendChild(newInput);
}


function changeImage() {
    const tournamentType = document.querySelector('.tournament-type').value;
    const imageContainer = document.getElementById('image-container');

    // Очищаем контейнер картинки перед добавлением новой
    imageContainer.innerHTML = '';

    // Создаем новый элемент изображения и добавляем его в контейнер
    const image = document.createElement('img');
    if (tournamentType === 'single') {
        image.src = '/static/single-elimination.svg'; // Путь к изображению для Single Elimination
    } else if (tournamentType === 'double') {
        image.src = '/static/double-elimination.svg'; // Путь к изображению для Double Elimination
    }
    imageContainer.appendChild(image);
}
changeImage();


function collectTeams() {
    const teamInputs = document.querySelectorAll('.tournament-teams');
    const teams = [];

    teamInputs.forEach(input => {
        if (input.value.trim() !== '') {
            teams.push(input.value.trim());
        }
    });

    document.getElementById('teams').value = JSON.stringify(teams);
}