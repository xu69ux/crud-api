import http from 'http';
import dotenv from 'dotenv';
import handleRequest from './handlers/requestHandler';
import { init } from './database';

dotenv.config();
init();

const server = http.createServer(handleRequest);

const port = process.env.PORT;

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
});