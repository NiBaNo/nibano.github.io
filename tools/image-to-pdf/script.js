const input = document.getElementById('file-input');
const preview = document.getElementById('preview-list');
const fileName = document.getElementById('file-name');
const generateBtn = document.getElementById('generate');

let files = [];

/* LOAD FILES */
input.addEventListener('change', (e) => {
  files = Array.from(e.target.files);
  fileName.textContent = files.length + " files selected";
  renderList();
});

/* RENDER LIST */
function renderList() {
  preview.innerHTML = '';

  files.forEach((file, index) => {
    const li = document.createElement('li');
    li.draggable = true;
    li.dataset.index = index;

    li.innerHTML = `
      <span>${file.name}</span>
    `;

    addDragEvents(li);
    preview.appendChild(li);
  });
}

/* DRAG & DROP */
let draggedIndex = null;

function addDragEvents(el) {
  el.addEventListener('dragstart', () => {
    draggedIndex = +el.dataset.index;
    el.style.opacity = 0.5;
  });

  el.addEventListener('dragend', () => {
    el.style.opacity = 1;
  });

  el.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  el.addEventListener('drop', () => {
    const targetIndex = +el.dataset.index;

    const temp = files[draggedIndex];
    files[draggedIndex] = files[targetIndex];
    files[targetIndex] = temp;

    renderList();
  });
}

/* GENERATE PDF */
generateBtn.addEventListener('click', async () => {
  if (files.length === 0) return;

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  for (let i = 0; i < files.length; i++) {
    const imgData = await fileToDataURL(files[i]);

    const img = new Image();
    img.src = imgData;

    await new Promise(resolve => {
      img.onload = () => {
        const width = pdf.internal.pageSize.getWidth();
        const height = (img.height * width) / img.width;

        if (i !== 0) pdf.addPage();
        pdf.addImage(img, 'JPEG', 0, 0, width, height);
        resolve();
      };
    });
  }

  const nameInput = document.getElementById('pdf-name');
    let fileName = nameInput.value.trim();

    if (!fileName) fileName = "images";

    pdf.save(fileName + ".pdf");
});

/* HELPERS */
function fileToDataURL(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}