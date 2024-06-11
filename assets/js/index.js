$(document).ready(function () {
    // Initialize variables
    let currentQuestionIndex = 1;
    let score = 0;
    let totalQuestions = 0;
    let quizData = {};
    let userAnswers = {};

    // Fetch quiz data from the JSON file
    fetch('assets/data/questions.json')
        .then(response => response.json())
        .then(data => {
            quizData = data;
            totalQuestions = Object.keys(quizData).length;
            loadQuestion();
        });

    // Function to load a question
    function loadQuestion() {
        const questionData = quizData[currentQuestionIndex];
        if (!questionData) {
            showResults();
            return;
        }

        // Update question number and text
        $('#indexQuestion').text(currentQuestionIndex);
        $('#question-text').text(questionData.question);
        $('#reponse-container').empty();

        // Populate answer choices
        questionData.choix.forEach((choix, index) => {
            const radioId = `choix${index}`;
            $('#reponse-container').append(`
                <div>
                    <input type="radio" id="${radioId}" name="choix" value="${index}">
                    <label for="${radioId}">${choix[0]}</label>
                </div>
            `);
        });

        // Restore user's previous answer if it exists
        if (userAnswers[currentQuestionIndex] !== undefined) {
            $(`input[name="choix"][value="${userAnswers[currentQuestionIndex]}"]`).prop('checked', true);
        }
    }

    // Handle the "Next" button click event
    $('#next-button').click(function () {
        const selectedChoice = $('input[name="choix"]:checked').val();
        if (selectedChoice !== undefined) {
            userAnswers[currentQuestionIndex] = parseInt(selectedChoice);
            if (quizData[currentQuestionIndex].choix[selectedChoice][1] === 1) {
                score++;
            }
            currentQuestionIndex++;
            loadQuestion();
        } else {
            alert("Please select an answer before proceeding.");
        }
    });

    // Function to display the quiz results
    function showResults() {
        $('#main-container').hide();
        $('#result-container').show();

        let resultDetailsHtml = '';
        Object.keys(quizData).forEach(questionIndex => {
            const questionData = quizData[questionIndex];
            const userAnswer = userAnswers[questionIndex];
            const correctAnswerIndex = questionData.choix.findIndex(choice => choice[1] === 1);

            resultDetailsHtml += `
                <div id="question-container">
                    <h2>QUESTION NO. ${questionIndex}</h2>
                    <h3>${questionData.question}</h3>
            `;

            // Display user's answer and the correct answer
            questionData.choix.forEach((choix, index) => {
                if (index === userAnswer) {
                    if (index === correctAnswerIndex) {
                        resultDetailsHtml += `<p class="correct-answer">Your answer: ${choix[0]}</p>`;
                    } else {
                        resultDetailsHtml += `<p class="incorrect-answer">Your answer: ${choix[0]}</p>`;
                    }
                } else if (index === correctAnswerIndex) {
                    resultDetailsHtml += `<p class="correct-answer">Correct answer: ${choix[0]}</p>`;
                }
            });

            resultDetailsHtml += `</div>`;
        });

        // Display the final score
        resultDetailsHtml += `<div id="question-container">
        <h2>RESULTS</h2>
        <h3>You scored ${score} out of ${totalQuestions} correct answers.</h3>
        <div>`;

        $('#result-details').html(resultDetailsHtml);
    }

    // Handle the "Restart" button click event
    $('#restart-button').click(function () {
        location.reload();
    });
});
