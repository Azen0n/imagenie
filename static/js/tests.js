function getQuestions() {
    let answerInputs = document.querySelectorAll('*[id^="answer"]');

    let answers = [[]];
    let question = 0;
    for (let answer of answerInputs) {
        let currentQuestion = parseInt(answer.id.split('-')[1]) - 1;
        if (currentQuestion === question) {
            answers[question].push(answer.checked);
        } else {
            answers.push([answer.checked]);
            question++;
        }
    }

    return answers;
}

let finishBtn = document.getElementById('finish-btn');
finishBtn.addEventListener('click', () => {
    let answers = getQuestions();
    let data = new FormData();
    data.append('answers', JSON.stringify(answers));

    $.ajax({
        method: 'POST',
        url: `${testId}/get_test_results/`,
        headers: {
            'X-CSRFToken': CSRF_TOKEN,
        },
        data: data,
        processData: false,
        contentType: false,
        mimeType: 'multipart/form-data',
        success: function (response) {
            showResults(JSON.parse(response)['correct_answers']);
        },
        error: function (error) {
            console.log(error);
        }
    });
});

function showResults(correctAnswers) {
    console.log(correctAnswers);
    let score = 0;
    let modalDescription = document.getElementById('modal-results');
    let content = `<div class="question-text">`;
    for (i in correctAnswers) {
        if (correctAnswers[i][0]) {
            score++;
        } else {
            content +=
                `<div class="instruction-number">${parseInt(i) + parseInt('1')}</div>
                <div class="instruction entry-text" id="modal-results">${correctAnswers[i][1]}</div>
                <div></div>
                <div class="modal-answer">Правильный ответ: ${correctAnswers[i][2]}</div>`;
        }
    }
    content += `</div>`;
    if (score === correctAnswers.length) {
        modalDescription.innerHTML = `<div class="description entry-text mb-3">Поздравляем, все верно!</div>`;
    } else {
        modalDescription.innerHTML = `<div class="description entry-text">Ошибки в вопросах:</div>` + content;
    }
    document.getElementById('modal-title').innerHTML = `Результат: ${score} из ${correctAnswers.length}`;
    document.getElementById('fader').classList.replace('d-none', 'd-block');
    document.getElementById('modal').classList.replace('d-none', 'd-block');
}

function closeModal() {
    document.getElementById('fader').classList.replace('d-block', 'd-none');
    document.getElementById('modal').classList.replace('d-block', 'd-none');
}

document.getElementById('fader').addEventListener('click', () => {
    closeModal();
});