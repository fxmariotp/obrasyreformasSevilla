const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.json': 'application/json',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    // Normalize URL and resolve local file path
    let safeUrl = req.url.split('?')[0];
    if (safeUrl === '/' || safeUrl === '/index.html') {
        safeUrl = '/piel canela/index.html';
    } else if (safeUrl === '/favicon.ico') {
        safeUrl = '/piel canela/assets/favicon.png';
    }
    
    const filePath = path.join(__dirname, safeUrl);
    
    // Check if path is within current directory to prevent directory traversal
    if (!filePath.startsWith(__dirname)) {
        res.statusCode = 403;
        res.end('403 Forbidden');
        return;
    }
    
    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.statusCode = 404;
            res.end('404 Not Found');
            return;
        }
        
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        
        res.writeHead(200, { 'Content-Type': contentType });
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/`);
});
