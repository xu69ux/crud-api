import { parse } from 'url';
import { getUsers, getUserById, addUser } from '../database';
import { User } from '../models/User';
import { validateUser } from '../validators/validateUser';
import { IncomingMessage, ServerResponse } from 'http';

function handleRequest(req: IncomingMessage, res: ServerResponse) {
  if (req.url) {
    const { pathname } = parse(req.url, true);
    if (pathname === '/users' && req.method === 'GET') {
      const users = getUsers();
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(users));
    } else if (pathname?.startsWith('/users/') && req.method === 'GET') {
      const id = pathname.split('/')[2];
      const user = getUserById(id);
      if (user) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(user));
      } else {
        res.statusCode = 404;
        res.end('User not found');
      }  
    } else if (pathname === '/users' && req.method === 'POST') {
      let body = '';
      req.on('data', (chunk: Buffer) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const user: User = JSON.parse(body);
        const validationError = validateUser(user);
        if (validationError) {
          res.statusCode = 400;
          res.end(`Bad request: ${validationError}`);
        } else {
          addUser(user);
          res.statusCode = 201;
          res.end('User added successfully');
        }
      });    
  } else {
      res.statusCode = 404;
      res.end('Not found');
  }
  } else {
    res.statusCode = 400;
    res.end('Bad request');
  }
}

export default handleRequest;