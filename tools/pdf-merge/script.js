const input = document.getElementById('file-input');
const preview = document.getElementById('preview-list');
const fileName = document.getElementById('file-name');
const mergeBtn = document.getElementById('merge');

let files = [];

/* LOAD FILES */
input.addEventListener('change', (e) => {
  files = Array.from(e.target.files);
  fileName.textContent = files.length + " file(s) selected";
  renderList();
});

/* RENDER LIST */
function renderList() {
  preview.innerHTML = '';

  files.forEach((file, index) => {
    const li = document.createElement('li');
    li.draggable = true;
    li.dataset.index = index;

    li.innerHTML = `<span>${file.name}</span>`;

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

/* MERGE PDFs */
mergeBtn.addEventListener('click', async () => {
  if (files.length === 0) return;

  const mergedPdf = await PDFLib.PDFDocument.create();

  for (let file of files) {
    const bytes = await file.arrayBuffer();
    const pdf = await PDFLib.PDFDocument.load(bytes);

    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach(page => mergedPdf.addPage(page));
  }

  const pdfBytes = await mergedPdf.save();

  const nameInput = document.getElementById('pdf-name');
  let name = nameInput.value.trim();
  if (!name) name = "merged";

  download(pdfBytes, name + ".pdf");
});

/* DOWNLOAD */
function download(bytes, filename) {
  const blob = new Blob([bytes], { type: "application/pdf" });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}