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


function charCounter(element, maxChars){
    element.addEventListener('input', function() {
        const lines = this.value.split('\n');
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].length > maxChars) {
                lines[i] = lines[i].substring(0, maxChars);
            }
        }
        this.value = lines.join('\n');
    });
}

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

function getMinDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes() + 1).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function handleSubmit(event) {
    const tournamentsList = document.getElementById("tournaments-list");
    const teamNames = document.getElementById('teamNames').value.trim();
    const lines = teamNames.split('\n').filter(function(line) {
        return line.trim() !== '';
    });

    if (lines.length < 2) {
        alert('Введите минимум две строки для названий команд.');
        event.preventDefault();
    } else {
        tournamentsList.style.filter = null;
        tournamentsList.style.pointerEvents = "auto";
    }
}


document.addEventListener("DOMContentLoaded", function() {
    const tournamentsIcon = document.getElementById("tournaments-icon");
    const tournamentsList = document.getElementById("tournaments-list");
    const mainContent = document.querySelector(".main-content");
    const pageLogo = document.querySelector(".page-logo");
    const form = document.getElementById("create-button");
    const createTournamentContainer = document.querySelector(".create-tournament-container");
    const teams = document.getElementById('teamNames')

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
        if (createTournamentContainer) {
            charCounter(teams, 50);
            changeImage();
            document.querySelector('form').addEventListener('submit', handleSubmit);
            const minDateTime = getMinDateTime();
            document.querySelector('.tournament_datetime').value = minDateTime;
            document.querySelector('.tournament_datetime').min = minDateTime;
        }
    }
});


function updateScoreColor() {
    let score1Elements = document.querySelectorAll('.score-1');
    let score2Elements = document.querySelectorAll('.score-2');
    let team1Elements = document.querySelectorAll('.team-1');
    let team2Elements = document.querySelectorAll('.team-2');

    for (let i = 0; i < score1Elements.length; i++) {
        const score1 = parseInt(score1Elements[i].textContent);
        const score2 = parseInt(score2Elements[i].textContent);

        if (score1 > score2) {
            score1Elements[i].style.background = '#35508a';
            team1Elements[i].style.background = '#35508a';
            score2Elements[i].style.background = '#555966';
            team2Elements[i].style.background = '#555966';
        } else if (score2 > score1) {
            score1Elements[i].style.background = '#555966';
            team1Elements[i].style.background = '#555966';
            score2Elements[i].style.background = '#35508a'; //#3d8a35 - зелененький
            team2Elements[i].style.background = '#35508a';
        }
    }
}
updateScoreColor();

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

async function advanceWinner(match_id, score1, score2) {
    const response = await makeRequest('POST', `/tournament/edit/${match_id}/`, {'score1': score1, 'score2': score2})
    const data = await response.json()
    if (data.success) {
        currentMatch = document.getElementById(match_id);
        nextMatch = document.getElementById(data.next_match_id);
        const team1Element = nextMatch.querySelector(".team-1");
        const score1Element = currentMatch.querySelector(".score-1");
        const team2Element = nextMatch.querySelector(".team-2");
        const score2Element = currentMatch.querySelector(".score-2");
        team1Element.textContent = data.team1;
        score1Element.textContent = data.score1;
        team2Element.textContent = data.team2;
        score2Element.textContent = data.score2;
        updateScoreColor();
    }
    console.log(data)
    return data;
}

function selectMatch(matchId) {
    const matchIdInput = document.getElementById('match-id');
    matchIdInput.value = matchId;
    const popupContainer = document.getElementById('popup-container');
    popupContainer.style.display = 'flex';
    const team1Score = document.getElementById('team1-score');
    charCounter(team1Score, 4);
    const team2Score = document.getElementById('team2-score');
    charCounter(team2Score, 4);
}

document.addEventListener('DOMContentLoaded', function() {
    const scoreForm = document.getElementById('score-form');
    const popupContainer = document.getElementById('popup-container');
    scoreForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const matchId = document.getElementById('match-id').value;
        const team1Score = document.getElementById('team1-score').value;
        const team2Score = document.getElementById('team2-score').value;
        advanceWinner(matchId, team1Score, team2Score);
        popupContainer.style.display = 'none';
        console.log(`Match ID: ${matchId}, Team 1 Score: ${team1Score}, Team 2 Score: ${team2Score}`);
    });
});