import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import { getUsers } from './database';

const server = http.createServer((req, res) => {
  if (req.url === '/users' && req.method === 'GET') {
      const users = getUsers();
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(users));
  } else {
      res.statusCode = 404;
      res.end('Not found');
  }
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
});