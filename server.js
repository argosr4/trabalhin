import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3001;

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav'
};

const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

    // Se a URL for a raiz, servir o index.html
    let filePath = req.url === '/'
        ? path.join(__dirname, 'index.html')
        : path.join(__dirname, req.url);

    // Obter a extensão do arquivo
    const extname = path.extname(filePath);
    let contentType = MIME_TYPES[extname] || 'application/octet-stream';

    // Ler e servir o arquivo
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Arquivo não encontrado
                console.log(`Arquivo não encontrado: ${filePath}`);
                res.writeHead(404);
                res.end('404 - Arquivo não encontrado');
            } else {
                // Erro de servidor
                console.error(`Erro ao ler arquivo: ${err.code}`);
                res.writeHead(500);
                res.end(`Erro no servidor: ${err.code}`);
            }
        } else {
            // Arquivo encontrado, servir com o tipo MIME correto
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Pressione Ctrl+C para encerrar o servidor`);
});
