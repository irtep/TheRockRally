// lap time clocks
// i should be able to do it from these parts:
/*
function setIntervalX(callback, delay) {
  var intervalID = window.setInterval(() => {
	  callback();
	  
    if (minutes === 0 && seconds1 === 0 && seconds2 === 0) {
					
			window.clearInterval(intervalID);
	  }
	}, delay);
}


						setIntervalX(function () { // activate the clock
 			 			   
							timeForAction("down");
						}, 1000);			// every 1 seconds


						if (seconds2 > 0) {
							seconds2--;
						} else if (seconds2 === 0 && seconds1 > 0){
							seconds2 = 9;
							seconds1--;
						} else if (minutes === 0 && seconds1 === 0 && seconds2 === 0) {	
							return;
						} else if (minutes > 0 && seconds1 === 0 && seconds2 === 0){
							minutes--;
							seconds2 = 9;
							seconds1 = 5;
						} else {
							
							seconds1 = 5;
							seconds2 = 9;
							minutes--;
						}
						refresh();
            */