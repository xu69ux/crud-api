import dotenv from 'dotenv';
dotenv.config();

import http from 'http';

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World\n');
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
});