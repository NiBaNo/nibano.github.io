async function resizeImages() {

  const files = document.getElementById('files').files;
  const prefix = document.getElementById('prefix').value;
  const width = parseInt(document.getElementById('width').value);
  const height = parseInt(document.getElementById('height').value);

  if (files.length === 0) {
    alert("Please upload images");
    return;
  }

  if (!prefix) {
    alert("Please enter a prefix");
    return;
  }

  const zip = new JSZip();
  const preview = document.getElementById('preview');
  preview.innerHTML = "";

  for (let i = 0; i < files.length; i++) {

    const file = files[i];

    const img = new Image();
    const url = URL.createObjectURL(file);

    await new Promise(resolve => {
      img.onload = resolve;
      img.src = url;
    });

    const canvas = document.createElement("canvas");
    canvas.width = width || img.width;
    canvas.height = height || img.height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const newName = `${prefix}_${i+1}.jpg`;

    const li = document.createElement("li");

    const blob = await new Promise(resolve =>
      canvas.toBlob(resolve, "image/jpeg", 0.9)
    );

    zip.file(newName, blob);

    li.innerHTML = `
      <span style="opacity:0.6">${file.name}</span>
      <span class="arrow-icon">
        <svg width="14" height="14" viewBox="0 0 24 24">
          <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2"/>
        </svg>
      </span>
      <span style="color:#aab6ff">${newName}</span>
    `;

    preview.appendChild(li);
    URL.revokeObjectURL(url);
  }

  // TRACK EVENT
  gtag('event', 'use_tool', { tool: 'image_resizer' });

  const zipBlob = await zip.generateAsync({ type: "blob" });
  saveAs(zipBlob, "resized_images.zip");
}

document.getElementById("files").addEventListener("change", function() {
  const files = this.files;
  const text = files.length > 0
          ? `${files.length} file(s) selected`
          : "No files selected";

  document.getElementById("file-name").textContent = text;
});

function resetTool() {
  document.getElementById("files").value = "";
  document.getElementById("prefix").value = "";
  document.getElementById("width").value = "";
  document.getElementById("height").value = "";
  document.getElementById("preview").innerHTML = "";
  document.getElementById("file-name").textContent = "No files selected";
}