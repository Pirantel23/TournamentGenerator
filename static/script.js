// Проверяем, существует ли элемент с id "sidebar"
const sidebar = document.getElementById('sidebar');

// Если элемент существует, добавляем обработчики событий
if (sidebar) {
    sidebar.addEventListener('mouseenter', function() {
        this.style.width = '150px';
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


document.addEventListener("DOMContentLoaded", function() {
    const tournamentsIcon = document.getElementById("tournaments-icon");
    const tournamentsList = document.getElementById("tournaments-list");
    const mainContent = document.querySelector(".main-content");
    const pageLogo = document.querySelector(".page-logo");
    const form = document.getElementById("create-button");
    const createTournamentContainer = document.querySelector(".create-tournament-container");
    const createTournamentForm = document.getElementById("create-tournament-form");

    if (tournamentsIcon) {
        tournamentsIcon.addEventListener("click", function() {
            tournamentsList.style.display = "flex";
            mainContent.style.display = "none";
            createTournamentContainer.style.display = "none";
            tournamentsList.style.filter = null;
            tournamentsList.style.pointerEvents = "auto";
        });

        pageLogo.addEventListener("click", function() {
            tournamentsList.style.display = "none";
            mainContent.style.display = "flex";
            createTournamentContainer.style.display = "none";
        });

        form.addEventListener("click", function() {
            mainContent.style.display = "none";
            createTournamentContainer.style.display = "flex";
            tournamentsList.style.filter = "blur(5px)";
            tournamentsList.style.pointerEvents = "none";
        });

        createTournamentForm.addEventListener("submit", function() {
            tournamentsList.style.filter = null;
            tournamentsList.style.pointerEvents = "auto";
        });
    }
});

function charCounter(){
    document.getElementById('teamNames').addEventListener('input', function() {
        const lines = this.value.split('\n');
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].length > 50) {
                lines[i] = lines[i].substring(0, 50);
            }
        }
        this.value = lines.join('\n');
    });
}
charCounter();

function changeImage() {
    const tournamentType = document.querySelector('.tournament-type').value;
    const imageContainer = document.getElementById('image-container');

    if (!tournamentType) {
        return;
    }
    imageContainer.innerHTML = '';

    const image = document.createElement('img');
    if (tournamentType === 'single') {
        image.src = '/static/single-elimination.svg';
    } else if (tournamentType === 'double') {
        image.src = '/static/double-elimination.svg';
    }
    imageContainer.appendChild(image);
}

changeImage();

function getMinDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes() + 1).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

document.addEventListener("DOMContentLoaded", function() {
    const minDateTime = getMinDateTime();
    document.querySelector('.tournament_datetime').value = minDateTime;
    document.querySelector('.tournament_datetime').min = minDateTime;
});

// Функция, которая будет вызываться при отправке формы
function handleSubmit(event) {
    const teamNames = document.getElementById('teamNames').value.trim();
    const lines = teamNames.split('\n').filter(function(line) {
        return line.trim() !== '';
    });

    if (lines.length < 2) {
        alert('Введите минимум две строки для названий команд.');
        event.preventDefault();
    }
}
document.querySelector('form').addEventListener('submit', handleSubmit);


// Говно код


async function makeRequest(method, url, data) {
    const response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        },
        body: JSON.stringify(data)
    })
    if (response.ok) {
        return response
    } else {
        let error = new Error('Error occurred during the fetch request.');
        console.error('ERROR: ', error);
        throw error
    }
}


async function deleteTournament(tournamentId) {
    const response = await makeRequest('POST', `/tournament/delete/${tournamentId}/`);
    const data = await response.json();
    if (data.success){
        const tournamentBlock = document.getElementById(tournamentId);
        tournamentBlock.remove();
    }
    console.log(data);
    return data;
}