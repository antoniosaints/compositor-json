document.getElementById('fileInput').addEventListener('change', function(event) {
    const fileName = event.target.files[0].name;
    const label = document.querySelector('.custom-file-upload');
    label.textContent = `Arquivo: ${fileName}`;
});

document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const fileInput = document.getElementById('fileInput');
    if (fileInput.files.length === 0) {
        alert('Por favor, escolha um arquivo CSV.');
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const jsonResult = JSON.stringify(data, null, 4);
        downloadJSON(jsonResult, 'relatorio_frequencia.json');
    })
    .catch(error => {
        console.error('Erro ao processar o arquivo:', error);
    });
});

function downloadJSON(jsonData, filename) {
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
