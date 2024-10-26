const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configurações do banco de dados
const dbConfig = {
    user: 'root',
    password: 'senha123',
    database: 'bancosv',
    host: 'localhost',
};
function backupDatabase() {
    const date = new Date().toISOString().slice(0, 10);
    const backupFile = path.join(__dirname, `backup-${date}.sql`);

    const command = `mysqldump -u ${dbConfig.user} -p${dbConfig.password} -h ${dbConfig.host} ${dbConfig.database} > ${backupFile}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error('Erro ao criar o backup:', error);
            return;
        }
        console.log('Backup do banco de dados criado com sucesso:', backupFile);
    });
}

module.exports = { backupDatabase };
