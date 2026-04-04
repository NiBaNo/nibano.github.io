const el = document.getElementById("passwordAnim");

const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";

function randomChar() {
  return chars[Math.floor(Math.random() * chars.length)];
}

function generateFakePassword(length = 14) {
  let str = "";
  for (let i = 0; i < length; i++) {
    str += randomChar();
  }
  return str;
}

function animateMatrix(text) {
  el.innerHTML = ""; 

  [...text].forEach((finalChar, i) => {
    const span = document.createElement("span");
    el.appendChild(span);

    const dropDelay = i * 0.10; 
    const maxIterations = 10;   

    // Delay starting the scramble to get the same moment as the drop
    setTimeout(() => {
      let iterations = 0;

      const scramble = setInterval(() => {
        span.textContent = randomChar();
        iterations++;

        if (iterations >= maxIterations) {
          clearInterval(scramble);
          span.textContent = finalChar;
        }
      }, 100); // scramble velocity
    }, dropDelay * 1000);

    span.style.animationDelay = dropDelay + "s"; 
  });
}

setInterval(() => {
  animateMatrix(generateFakePassword(14));
}, 2000); 



