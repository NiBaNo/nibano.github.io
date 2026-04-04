const input = document.getElementById("input");
const output = document.getElementById("output");
const errorBox = document.getElementById("error");
const statusBox = document.getElementById("status");
const copyBtn = document.getElementById("copyBtn");

document.getElementById("formatBtn").addEventListener("click", () => processJSON("format"));
document.getElementById("minifyBtn").addEventListener("click", () => processJSON("minify"));
copyBtn.addEventListener("click", copyJSON);

function processJSON(type) {
  resetUI();

  try {
    const parsed = JSON.parse(input.value);

    let result;

    if (type === "format") {
      result = JSON.stringify(parsed, null, 2);
      statusBox.textContent = "Formatted JSON successfully";
    } else {
      result = JSON.stringify(parsed);
      statusBox.textContent = "Minified JSON successfully";
    }

    output.textContent = result;
    copyBtn.classList.remove("hidden");

  } catch (e) {
    handleError(e);
  }
}

function copyJSON() {
  if (!output.textContent) return;

  navigator.clipboard.writeText(output.textContent);

  statusBox.textContent = "Copied to clipboard";
}

function resetUI() {
  errorBox.textContent = "";
  statusBox.textContent = "";
  output.textContent = "";
  copyBtn.classList.add("hidden");
}

function handleError(e) {
  output.textContent = "";

  let message = e.message;

  const match = message.match(/position (\d+)/);

  if (match) {
    const pos = match[1];
    message += ` (at character ${pos})`;
  }

  errorBox.textContent = "Invalid JSON: " + message;
}