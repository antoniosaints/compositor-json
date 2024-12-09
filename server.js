const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const processAttendance = require('./src/processAttendance');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(fileUpload());

app.post('/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('Nenhum arquivo foi enviado.');
    }

    const file = req.files.file;
    const filePath = path.join(__dirname, 'uploads', `relatorio_mensal${path.extname(file.name)}`);

    file.mv(filePath, (err) => {
        if (err) {
            return res.status(500).send(err);
        }

        processAttendance(filePath)
            .then(results => {
                res.json(results);
            })
            .catch(error => {
                res.status(500).send(`Erro ao processar o arquivo: ${error.message}`);
            });
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
