$(document).ready(function(){
  
  // event listeners
  $("#remaining-time").hide();
  $(".ques").hide();
  $("#options").hide();
  $("#start").on('click', trivia.startGame);
  
  $(document).on('click' , '.option', trivia.guessChecker);
  
})

var trivia = {
  // trivia properties
  correct: 0,
  incorrect: 0,
  unanswered: 0,
  currentSet: 0,
  timer: 20,
  timerOn: false,
  timerId : '',
  // questions options and answers data
  questions: {
    q1: 'What is the world\'s longest river?',
    q2: 'What is the world\'s largest ocean?',
    q3: 'What is the diameter of Earth?',
    q4: 'What is the most ancient forest?',
    q5: "What is the capital city of Spain?",
    q6: 'Which country is Prague in?',
    q7: "What is the world\'s biggest island?"
  },
  options: {
    q1: ['Amazon river', ' River Niles', 'Missisippi River', 'Ganges river'],
    q2: ['Atlantic', 'Pacific', 'Indian', 'Arctic'],
    q3: ['5000mi(approx)', '8000mi(approx)', '7500mi(approx)', '6200mi(approx)'],
    q4: ['Yukushima Forest ', 'Kamakega Forest', 'Tongass National Forest', 'Daintree Forest'],
    q5: ['Barcelona','Seville','Madrid','Malaga'],
    q6: ['Austria','Czech Republic','Poland','Germany'],
    q7: ['New Guinea', 'Victoria Island', 'Greenland','Baffin Island']
  },
  answers: {
    q1: 'Amazon river',
    q2: 'Pacific',
    q3: '8000mi(approx)',
    q4: 'Daintree Forest',
    q5: 'Madrid',
    q6: 'Czech Republic',
    q7: 'Greenland'
  },


  // trivia methods
  // method to initialize game
  startGame: function(){
    // restarting game results
    trivia.currentSet = 0;
    trivia.correct = 0;
    trivia.incorrect = 0;
    trivia.unanswered = 0;
    clearInterval(trivia.timerId);
    
    // show game section
    $('#game').show();
    $(".ques").show();
    $("#options").show();
    
    //  empty last results
    $('#results').html('');
    
    // show timer
    $('#timer').text(trivia.timer);
    
    // remove start button
    $('#start').hide();

    $('#remaining-time').show();
    
    // ask first question
    trivia.nextQuestion();    
  },
  
  // method to loop through and display questions and options 
  nextQuestion : function(){
    
    // set timer to 20 seconds each question
    trivia.timer = 10;
     $('#timer').removeClass('last-seconds');
    $('#timer').text(trivia.timer);
    
    // to prevent timer speed up
    if(!trivia.timerOn){
      trivia.timerId = setInterval(trivia.timerRunning, 1000);
    }
    
    // gets all the questions then indexes the current questions
    var questionContent = Object.values(trivia.questions)[trivia.currentSet];
    $('#questions').text(questionContent);
    
    // an array of all the user options for the current question
    var questionOptions = Object.values(trivia.options)[trivia.currentSet];
    
    // creates all the trivia guess options in the html
    $.each(questionOptions, function(index, key){
      $('#options').append($('<button class="option">'+key+'</button>'));
    })
    
  },
  // method to decrement counter and count unanswered if timer runs out
  timerRunning : function(){
    // if timer still has time left and there are still questions left to ask
    if(trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length){
      $('#timer').text(trivia.timer);
      trivia.timer--;
        
    }
    // the time has run out and increment unanswered, run result
    else if(trivia.timer === -1){
      trivia.unanswered++;
      trivia.result = false;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);

    }
    // if all the questions have been shown end the game, show results
    else if(trivia.currentSet === Object.keys(trivia.questions).length){
      
      // adds results of game (correct, incorrect, unanswered) to the page
      $('.container')
        .html('<h3>Thank you for playing!</h3>'+
        '<p>Correct: '+ trivia.correct +'</p>'+
        '<p>Incorrect: '+ trivia.incorrect +'</p>'+
        '<p>Unaswered: '+ trivia.unanswered +'</p>'+
        '<p>Please play again!</p>');
      
      // hide game sction
      $('#game').hide();
      
      // show start button to begin a new game
      $('#start').show();
    }
    
  },
  // method to evaluate the option clicked
  guessChecker : function() {
    
    // timer ID for gameResult setTimeout
    var resultId;
    
    // the answer to the current question being asked
    var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];
    
    // if the text of the option picked matches the answer of the current question, increment correct
    if($(this).text() === currentAnswer){
      
      // turn button green for correct
      $(this).addClass('btn-success').removeClass('btn-info');
      
      trivia.correct++;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
    }

    // else the user picked the wrong option, increment incorrect
    else{
      // turn button clicked red for incorrect
      
      trivia.incorrect++;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $(this).addClass('btn-danger').removeClass('btn-info');

    }
    
  },
  // method to remove previous question results and options
  guessResult : function(){
    
    // increment to next question set
    trivia.currentSet++;
    
    // remove the options and results
    $('.option').remove();
    $('#results h3').remove();
    
    // begin next question
    trivia.nextQuestion();
     
  }

}