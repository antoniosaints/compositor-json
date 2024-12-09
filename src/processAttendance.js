const fs = require('fs');
const csv = require('csv-parser');
const { parse } = require('date-fns');

function processAttendance(inputFile, encoding = 'latin1') {
    return new Promise((resolve, reject) => {
        const results = [];
        const punctualityLimit = parse('07:50', 'HH:mm', new Date());

        fs.createReadStream(inputFile, { encoding })
            .pipe(csv({ separator: ';' }))
            .on('data', (data) => {
                try {
                    const nome = data['nome'];
                    const dataEntrada = parse(data['data'], 'dd/MM/yyyy', new Date());
                    const entrada1 = parse(data['entrada_1'], 'HH:mm', new Date());

                    if (!isNaN(entrada1.getTime())) { // Verifica se a entrada_1 está registrada com um horário válido
                        const mes = dataEntrada.getMonth() + 1;
                        const ano = dataEntrada.getFullYear();
                        const entrada1Time = entrada1;

                        const existing = results.find(r => r.nome === nome && r.mes === mes && r.ano === ano);
                        if (existing) {
                            existing.dias_trabalhados += 1;
                            if (entrada1Time <= punctualityLimit) {
                                existing.dias_pontuais += 1;
                            }
                        } else {
                            results.push({
                                nome,
                                dias_trabalhados: 1,
                                dias_pontuais: entrada1Time <= punctualityLimit ? 1 : 0,
                                mes,
                                ano
                            });
                        }
                    }
                } catch (error) {
                    console.error(`Erro ao processar a linha: ${error.message}`);
                }
            })
            .on('end', () => {
                resolve(results);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

module.exports = processAttendance;
