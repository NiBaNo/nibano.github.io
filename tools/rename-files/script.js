async function renameFiles() {

  // Add selected files
  const files = document.getElementById('files').files;

  if (files.length === 0) {
    alert("Please upload files");
    return;
  }

  // Add prefix
  const prefix = document.getElementById('prefix').value;

  if (!prefix) {
    alert("Please enter a prefix");
    return;
  }

  const zip = new JSZip();

  // Preview zone
  const preview = document.getElementById('preview');
  preview.innerHTML = "";

  for (let i = 0; i < files.length; i++) {

    const file = files[i];

    // (.jpg, .png...)
    const extension = file.name.split('.').pop();

    // New name
    const newName = `${prefix}_${i+1}.${extension}`;

    const li = document.createElement("li");

    li.innerHTML = `
      <span style="opacity:0.6">${file.name}</span>
      <span class="arrow-icon">
        <svg width="14" height="14" viewBox="0 0 24 24">
          <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
      <span style="color:#aab6ff">${newName}</span>
    `;
    preview.appendChild(li);

    // Read file content
    const content = await file.arrayBuffer();

    // Add renamed files to zip
    zip.file(newName, content);
  }

  // TRACK EVENT
  gtag('event', 'use_tool', {tool: 'rename_files'});

  // Generate final ZIP
  const zipBlob = await zip.generateAsync({ type: "blob" });

  // Download ZIP
  saveAs(zipBlob, "renamed_files.zip");
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
  document.getElementById("preview").innerHTML = "";
  document.getElementById("file-name").textContent = "No files selected";
}