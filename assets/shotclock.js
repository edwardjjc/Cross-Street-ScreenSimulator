$(document).ready(function() {

  // Change this number if you want a different
  // timer in your shotclock!
  var seconds = 0;

  let socket = new WebSocket("ws://localhost:8082");

  socket.onmessage = function(event) {
      //alert(`[message] Data received from server: ${event.data}`);
      let parse =  JSON.parse(event.data);
      console.log(event.data);

      setTimeout(() => {
        if(parse.event == "INICIO_CRUCE_CALLE"){
          seconds = parse.tiempoMs;
          seconds = seconds/1000;
          handleStart();
        };
      }, parse.tiempoInicioEventoMS);
  };


// ------------------------------------------ //

  // Save reference to shot clock element
  var $shotClock = $('.shot_clock');

  // Set initial time
  var resetShotClockDisplay = function() {
    $shotClock.html(seconds);
  };

  // Set up timer
  var milliseconds = seconds * 1000;
  var timer = new Tock({
    countdown: true,
    interval: 1000,
    callback: function() {
      milliseconds = timer.lap();
      $shotClock.html(Math.round(milliseconds / 1000));
      var msg = new SpeechSynthesisUtterance(Math.round(milliseconds / 1000).toString());
    
      msg.lang = 'es';
      //msg.rate = 1; 
      window.speechSynthesis.speak(msg); 
    },
    complete: function() {
      var msg = new SpeechSynthesisUtterance("Times up");
    
      msg.lang = 'es';
      msg.rate = 4; 
      console.log('red');
    }
  });

  var inInitialState = true;
  var blanked = false;
  resetShotClockDisplay();

  var handleStart = function() {
    if (inInitialState) {
      
      timer.start(seconds * 1000);
      inInitialState = true;
    } else {
      timer.pause();
    }
  };
  var handleRestart = function() {
    timer.stop();
    timer.reset();
    resetShotClockDisplay();
    inInitialState = true;
  };
  var handleBlank = function() {
    if (blanked) {
      $shotClock.addClass('blanked');
    } else {
      $shotClock.removeClass('blanked');
    }
    blanked = !blanked;
  };

  $(document).keydown(function(e) {
    var code = e.keyCode;
    // s
    if (code === 83) {
      handleStart();
    // r
    } else if (code === 82) {
      handleRestart();
    // b
    } else if (code === 66) {
      handleBlank();
    }
  });

  // timer.start(milliseconds);

  // Set up button handlers


});
