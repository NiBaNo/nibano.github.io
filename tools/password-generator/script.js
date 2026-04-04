const lengthSlider = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");

const lettersCheck = document.getElementById("letters");
const numbersCheck = document.getElementById("numbers");
const symbolsCheck = document.getElementById("symbols");

const output = document.getElementById("passwordOutput");
const strength = document.getElementById("strength");

document.getElementById("generate").addEventListener("click", generatePassword);
document.getElementById("copy").addEventListener("click", copyPassword);
document.getElementById("download").addEventListener("click", downloadPassword);

lengthSlider.addEventListener("input", () => {
  lengthValue.textContent = lengthSlider.value;
});

function generatePassword() {
  const length = parseInt(lengthSlider.value);

  let chars = "";
  if (lettersCheck.checked) chars += "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (numbersCheck.checked) chars += "0123456789";
  if (symbolsCheck.checked) chars += "!@#$%^&*()_+{}[]<>?/";

  if (!chars) {
    output.textContent = "Select at least one option";
    return;
  }

  let password = "";

  const cryptoObj = window.crypto || window.msCrypto;

  for (let i = 0; i < length; i++) {
    const array = new Uint32Array(1);
    cryptoObj.getRandomValues(array);
    password += chars[array[0] % chars.length];
  }

  output.textContent = password;
  evaluateStrength(password);
}

function evaluateStrength(pw) {
  let score = 0;

  if (pw.length > 8) score++;
  if (pw.length > 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 2) strength.textContent = "Weak";
  else if (score <= 4) strength.textContent = "Medium";
  else strength.textContent = "Strong";
}

function copyPassword() {
  if (!output.textContent) return;
  navigator.clipboard.writeText(output.textContent);
  strength.textContent = "Copied to clipboard";
}

function downloadPassword() {
  if (!output.textContent) return;

  const blob = new Blob([output.textContent], { type: "text/plain" });
  const a = document.createElement("a");

  a.href = URL.createObjectURL(blob);
  a.download = "password.txt";
  a.click();
}