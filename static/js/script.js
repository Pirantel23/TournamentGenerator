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
    } else if (lines.every(function(line) {
        return line === lines[0];
    })) {
        alert('Введите разные названия команд.');
        event.preventDefault();
    } else {
        tournamentsList.style.filter = null;
        tournamentsList.style.pointerEvents = "auto";
    }
}

// function changeImage() {
//     const tournamentType = document.querySelector('.tournament-type').value;
//     const tournamentImg = document.getElementById("tournament-img");

//     if (!tournamentType) {
//         return;
//     }

//     if (tournamentType === 'single') {
//         tournamentImg.src = '/static/single-elimination.svg';
//     } else if (tournamentType === 'double') {
//         tournamentImg.src = '/static/double-elimination.svg';
//     }
// }

document.addEventListener("DOMContentLoaded", function() {

    function resetTournamentForm() {
        createTournamentForm.reset();
        charCounter(teams, 50);
        // changeImage();
        document.querySelector('form').addEventListener('submit', handleSubmit);
        const minDateTime = getMinDateTime();
        document.querySelector('.tournament_datetime').value = minDateTime;
        document.querySelector('.tournament_datetime').min = minDateTime;
    }

    function resetPopupContainer(){
        overlay.style.display = 'none';
        matchId.value = '';
        team1Score.value = '';
        team2Score.value = '';
        popupContainer.style.display = 'none';
    }

    const tournamentsList = document.querySelector("#tournaments-list");
    const helpLogo =  document.querySelector(".help-logo");
    const helpMessage = document.querySelector(".help-message");
    const pageLogo = document.querySelector(".page-logo");
    const form = document.querySelector("#create-button");
    const createTournamentContainer = document.querySelector(".tournament-creator");
    const teams = document.querySelector('#teamNames');
    const overlay = document.querySelector('#overlay');
    const createTournamentForm = document.querySelector('#create-tournament-form');
    const chatLogo = document.querySelector('.chat-logo');
    const chatContainer = document.querySelector('.chat-container');


    const scoreForm = document.getElementById('score-form');
    const popupContainer = document.getElementById('popup-container');
    const matchId = document.getElementById('match-id');
    const team1Score = document.getElementById('team1-score');
    const team2Score = document.getElementById('team2-score');

    if (scoreForm) {
        overlay.addEventListener('click', function(event) {
            if (event.target === overlay) {
                resetPopupContainer();
            }});

        scoreForm.addEventListener('submit', function(event) {
            event.preventDefault();

            advanceWinner(matchId.value, team1Score.value, team2Score.value);
            resetPopupContainer();
        });
    }

    overlay.addEventListener('click', function(event) {
        if (event.target === overlay && tournamentsList) {
            createTournamentContainer.style.display = "none";
            resetTournamentForm();
            overlay.style.display = 'none';
            helpMessage.style.display = "none";
        } else if (event.target === overlay) {
            overlay.style.display = 'none';
            helpMessage.style.display = "none";
        }
    });

    if (overlay) {
        helpLogo.addEventListener("click", function() {
            helpMessage.style.display = "flex";
            overlay.style.display = 'block';
        });

        pageLogo.addEventListener("click", function() {
            helpMessage.style.display = "none";
            createTournamentContainer.style.display = "none";
        });

        document.addEventListener('click', function(event) {
            if (!chatContainer.contains(event.target) && event.target !== chatLogo) {
                chatContainer.style.display = "none";
            }
        });
        chatLogo.addEventListener("click", function (event) {
            event.stopPropagation();
            chatContainer.style.display = "flex";
        });

        if (form){
            form.addEventListener("click", function() {
                createTournamentContainer.style.display = "flex";
                overlay.style.display = 'block';
            });
        }

        if (createTournamentContainer) {
            resetTournamentForm();
        }
    }
});


function updateScoreColor() {
    const score1Elements = document.querySelectorAll('.score-1');
    const score2Elements = document.querySelectorAll('.score-2');
    const team1Elements = document.querySelectorAll('.team-1');
    const team2Elements = document.querySelectorAll('.team-2');

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
    if (score1 === score2) {
        selectMatch(match_id);
        alert('Невозможно определить победителя: счет равный.');
    }
    if (data.success) {
        const currentMatch = document.getElementById(match_id);
        const next_match_id = data.next_match_id;
        currentMatch.onclick = null;
        if (next_match_id){
            const nextMatch = document.getElementById(data.next_match_id);
            const team1Element = nextMatch.querySelector(".team-1");
            const team2Element = nextMatch.querySelector(".team-2");
            if (data.team1 && data.team2){
                nextMatch.onclick = function() {
                    selectMatch(next_match_id);
                }
            }
            team1Element.textContent = data.team1;
            team2Element.textContent = data.team2;
        }
        const score1Element = currentMatch.querySelector(".score-1");
        const score2Element = currentMatch.querySelector(".score-2");
        score1Element.textContent = data.score1;
        score2Element.textContent = data.score2;
        updateScoreColor();
    }
    console.log(data)
    return data;
}

function selectMatch(matchId) {
    const matchIdInput = document.getElementById('match-id');
    matchIdInput.value = matchId;
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'block';
    const popupContainer = document.getElementById('popup-container');
    popupContainer.style.display = 'flex';


    const match = document.getElementById(matchId);
    const team1Name = match.querySelector('.team-1').textContent;
    const team2Name = match.querySelector('.team-2').textContent;
    const team1Label = document.getElementById('team1-label');
    team1Label.textContent = team1Name;
    const team2Label = document.getElementById('team2-label');
    team2Label.textContent = team2Name;
    const team1Score = document.getElementById('team1-score');
    charCounter(team1Score, 4);
    const team2Score = document.getElementById('team2-score');
    charCounter(team2Score, 4);
}




function initChat(roomName, admin="") {
    document.querySelector('.chat-logo').onclick = null;
    const chatSocket = new WebSocket(
        'ws://' + window.location.host + '/ws/chat/' + roomName
    );

    chatSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        const message = data.message;
        const chatLog = document.querySelector('#chat-log');
        if (admin && data.sender === admin){
            if (message.startsWith('!')){
                alert(message.substring(1))
                chatLog.value += `ОБЪЯВЛЕНИЕ: ${message.substring(1)}\n`;
            } else {
                chatLog.value += `[ADMIN] ${data.sender}: ${message}\n`;
            }
        } else {
            chatLog.value += `${data.sender}: ${message}\n`;
        }
        chatLog.scrollTop = chatLog.scrollHeight;
    };

    chatSocket.onclose = function(e) {
        console.error('Chat socket closed unexpectedly');
    };

    document.querySelector('#chat-message-input').focus();
    document.querySelector('#chat-message-input').onkeyup = function(e) {
        if (e.keyCode === 13) {  // enter, return
            document.querySelector('#chat-message-submit').click();
        }
    };

    document.querySelector('#chat-message-submit').onclick = function(e) {
        const messageInputDom = document.querySelector('#chat-message-input');
        const message = messageInputDom.value;
        if (!message) {
            return;
        }
        chatSocket.send(JSON.stringify({
            'message': message
        }));
        messageInputDom.value = '';
    };
}
