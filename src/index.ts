import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import handleRequest from './handlers/requestHandler';

const server = http.createServer(handleRequest);

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
});