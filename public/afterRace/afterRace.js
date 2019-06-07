


//  -------- ONLOAD:  ------------
window.onload = (()=> { 
  
  // load gameObject from localStorage:
  const gameObject = JSON.parse(localStorage.getItem('Go'));  
  
  console.log('afterRace ', gameObject);
});