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

    const tournamentType = document.querySelector('.tournament-type').value;

    if (tournamentType === 'double') {
        alert('Тип турнира «Double Elimination» находится в разработке.');
        event.preventDefault();
        return;
    }

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

function changeImage() {
    const tournamentType = document.querySelector('.tournament-type').value;
    const tournamentImg = document.getElementById("tournament-img");

    if (!tournamentType) {
        return;
    }

    if (tournamentType === 'single') {
        tournamentImg.src = '/static/svg/single-elimination.svg';
    } else if (tournamentType === 'double') {
        tournamentImg.src = '/static/svg/double-elimination.svg';
    }
}

document.addEventListener("DOMContentLoaded", function() {

    function resetTournamentForm() {
        createTournamentForm.reset();
        charCounter(teams, 50);
        changeImage();
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
            if (chatContainer.style.display === "flex") {
                chatContainer.style.animation = "moveUpChat 0.3s forwards";
                setTimeout(() => {
                    chatContainer.style.display = "none";
                }, 300);
            } else {
                chatContainer.style.display = "flex";
                chatContainer.style.animation = "moveDownChat 0.3s forwards";
            }
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


async function makeRequest(method, url, data, throwError=true) {
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
    } else if (throwError){
        let error = new Error('Error occurred during the fetch request.');
        console.error('ERROR: ', error);
        throw error
    } else {
        return response
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

function initChat(room, admin='') {
    sendMessage(room, 'join', 'join');
    console.log('Initializing chat...');
    document.querySelector('.chat-logo').onclick = null;

    document.querySelector('#chat-message-submit').onclick = function() {
        const message = document.querySelector('#chat-message-input').value;
        if (!message) {
            return;
        }
        sendMessage(room, message, "message");
        document.querySelector('#chat-message-input').value = '';
        disableSendMessageButton();
    }

    document.querySelector('#chat-message-input').focus();
    document.querySelector('#chat-message-input').onkeyup = function(e) {
        if (e.keyCode === 13) {  // enter, return
            document.querySelector('#chat-message-submit').click();
        }
    };

    window.onbeforeunload = function() {
        sendMessage(room, 'leave', 'leave');
    }


    let longPolling = false;

    async function sendMessage(chatRoom, message, type) {
        const response = await makeRequest('POST', `/chat/send/`, {'content': message, 'room': chatRoom, 'type': type})
        const data = await response.json();
        console.log(data);
        if (data.success) {
            const chatLog = document.querySelector('#chat-log');
            chatLog.value += formatMessage(data.sender, data.content, data.type, data.timestamp, chatRoom) + '\n';
            chatLog.scrollTop = chatLog.scrollHeight;
            if (!longPolling) {
                longPolling = true;
                longPollmessages(chatRoom, data.last_message_id);
            }
        console.log(data);
        }
    }

    function formatMessage(sender, content, type, timestamp='', room='') {
        let name = sender;
        let message = content;
        if (sender === admin) {
            name = `[Организатор] ${sender}`;
        }
        if (content.startsWith('!') && sender === admin) {
            message = content.substring(1);
            name = 'ОБЪЯВЛЕНИЕ'
            alert(message)
        }
        switch (type) {
            case 'join':
                return `${name} присоединился к чату ${room}.`;
            case 'leave':
                return `${name} покинул чат.`;
            case 'message':
                return `${name}: ${message}`;
        }
    }

    async function longPollmessages(chatRoom, lastMessageId) {
        longPolling = true;
        console.log(`Starting long polling from message ${lastMessageId}`)
        const response = await makeRequest('POST', '/chat/get/', {'room': chatRoom, 'last_message_id': lastMessageId}, false)
        if (response.status !== 200) {
            console.error('Error occurred during long polling.');
            console.log(response);
            longPolling = false;
        }
        const messages = await response.json();
        if (messages.length > 0) {
            console.log(`Received ${messages.length} messages.`);
            updateChat(messages);
            longPollmessages(chatRoom, messages[messages.length - 1].id);
        } else {
            console.log('No new messages, polling again...');
            longPollmessages(chatRoom, lastMessageId);
        }
    }

    function updateChat(messages) {
        console.log(`Updating chat with ${messages.length} messages.`)
        const chatLog = document.querySelector('#chat-log');
        messages.forEach(function(message) {
            chatLog.value += formatMessage(message.sender, message.content, message.type, message.timestamp, message.room) + '\n';
        });
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    function disableSendMessageButton() {
        isSending = true;
        document.querySelector('#chat-message-submit').disabled = true;
        const progressBar = document.querySelector('#progress-bar');
        progressBar.style.width = '0%';
        let width = 0;
        const duration = 2000;
        const intervalTime = 100;

        const interval = setInterval(function() {
            if (width >= 100) {
                clearInterval(interval);
                enableSendMessageButton();
            } else {
                width += (intervalTime / duration) * 100;
                progressBar.style.width = width + '%';
            }
        }, intervalTime);
    }

    function enableSendMessageButton() {
        isSending = false;
        document.querySelector('#chat-message-submit').disabled = false;
        document.querySelector('#progress-bar').style.width = '0';
    }
}