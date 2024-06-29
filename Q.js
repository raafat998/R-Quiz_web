document.addEventListener('DOMContentLoaded', () => {
  let currentQuestionIndex = 0;
  let questions = [];
  let selectedAnswer = '';
  const totalTime = 10 * 60; // 10 minutes in seconds
  let remainingTime = totalTime;
  let timerInterval;

  fetch('./data.json')
      .then(res => res.json())
      .then(data => {
          questions = data.Technical_Skills_Quiz.Question;
          displayQuestion();
          startTimer();
      })
      .catch(error => {
          console.error('Error fetching the data:', error);
      });

      function displayQuestion() {
        const questionElement = document.querySelector('.question');
        const answersElements = document.querySelectorAll('.answer .text');
        const answerWrappers = document.querySelectorAll('.answer');
        const currentElement = document.querySelector('.current');
        const totalElement = document.querySelector('.total');
        const submitButton = document.querySelector('.submit');
  
        const question = questions[currentQuestionIndex];
  
        questionElement.textContent = question[`Question ${currentQuestionIndex + 1}`];
        answersElements[0].textContent = question['asnwer_1'];
        answersElements[1].textContent = question['asnwer_2'];
        answersElements[2].textContent = question['asnwer_3'];
        answersElements[3].textContent = question['asnwer_4'];
  
        currentElement.textContent = currentQuestionIndex + 1;
        totalElement.textContent = `/${questions.length}`;
  
        // Reset selected state
        answerWrappers.forEach(wrapper => wrapper.classList.remove('selected', 'correct', 'wrong'));
        submitButton.disabled = true;
        submitButton.textContent = currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next';
    }
  function handleAnswerClick(event) {
      const answerWrappers = document.querySelectorAll('.answer');
      answerWrappers.forEach(wrapper => wrapper.classList.remove('selected'));
      event.currentTarget.classList.add('selected');
      selectedAnswer = event.currentTarget.querySelector('.text').textContent;

      // Enable submit button
      document.querySelector('.submit').disabled = false;
  }

  document.querySelectorAll('.answer').forEach(answer => {
      answer.addEventListener('click', handleAnswerClick);
  });

  document.querySelector('.submit').addEventListener('click', () => {
      const question = questions[currentQuestionIndex];
      const correctAnswer = question['correct_answer'];
      const answerWrappers = document.querySelectorAll('.answer');

      answerWrappers.forEach(wrapper => {
          const answerText = wrapper.querySelector('.text').textContent;
          if (answerText === correctAnswer) {
              wrapper.classList.add('correct');
          } else if (wrapper.classList.contains('selected')) {
              wrapper.classList.add('wrong');
          } else {
              wrapper.classList.add('wrong');
          }
      });

      // Disable submit button after submission
      document.querySelector('.submit').disabled = true;

      // Store selected answer in questions array
      question.selectedAnswer = selectedAnswer;

      setTimeout(() => {
          if (currentQuestionIndex < questions.length - 1) {
              currentQuestionIndex++;
              displayQuestion();
          } else {
              console.log('Quiz completed');

              // Store questions array in local storage
              localStorage.setItem('questions', JSON.stringify(questions));

              // Redirect to results page
              window.location.href = 'Q2.html';
          }
      }, 2000); // 2-second delay
  });

  function startTimer() {
      const progressBar = document.querySelector('.progress-bar');
      const progressText = document.querySelector('.progress-text');

      timerInterval = setInterval(() => {
          remainingTime--;

          // Update progress bar and text
          const minutes = Math.floor(remainingTime / 60);
          const seconds = remainingTime % 60;
          progressText.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

          const progressPercent = (remainingTime / totalTime) * 100;
          progressBar.style.width = `${progressPercent}%`;

          // Check if time is up
          if (remainingTime <= 0) {
              clearInterval(timerInterval);
              console.log('Time is up!');
              // Handle end of quiz due to time out
          }
      }, 1000);
  }

  // Back button functionality
  document.querySelector('.back').addEventListener('click', () => {
      if (currentQuestionIndex > 0) {
          currentQuestionIndex--;
          displayQuestion();
      }
  });
});
