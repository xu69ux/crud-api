import { parse } from 'url';
import { getUsers, getUserById, addUser, updateUser, deleteUser } from '../database';
import { User } from '../models/User';
import { validateUser } from '../validators/validateUser';
import { validateUpdateUser } from '../validators/validateUpdateUser';
import { validate as validateUuid } from 'uuid';
import { IncomingMessage, ServerResponse } from 'http';

export function handleRequest(req: IncomingMessage, res: ServerResponse) {
  if (req.url) {
    const { pathname } = parse(req.url, true);
    if (pathname === '/users' && req.method === 'GET') {
      const users = getUsers();
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end('All users: ' + JSON.stringify(users));
    } else if (pathname?.startsWith('/users/') && req.method === 'GET') {
      const id = pathname.split('/')[2];
      if (!validateUuid(id)) {
        res.statusCode = 400;
        res.end('Invalid user ID');
        return;
      }
      const user = getUserById(id);
      if (user) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end('User found: ' + JSON.stringify(user));
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
    } else if (pathname?.startsWith('/users/') && req.method === 'PUT') {
      const id = pathname.split('/')[2];
      if (!validateUuid(id)) {
        res.statusCode = 400;
        res.end('Invalid user ID');
        return;
      }
      let body = '';
      req.on('data', (chunk: Buffer) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const updatedUser: User = JSON.parse(body);
        const validationError = validateUpdateUser(updatedUser);
        if (validationError) {
          res.statusCode = 400;
          res.end(`Bad request: ${validationError}`);
          return;
        }
        const user = updateUser(id, updatedUser);
        if (user) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end('User updated successfully: ' + JSON.stringify(user));
        } else {
          res.statusCode = 404;
          res.end('User not found');
        }
      });
    } else if (pathname?.startsWith('/users/') && req.method === 'DELETE') {
      const id = pathname.split('/')[2];
      if (!validateUuid(id)) {
          res.statusCode = 400;
          res.end('Invalid user ID');
          return;
      }
      const isDeleted = deleteUser(id);
      if (isDeleted) {
          res.statusCode = 204;
          res.end('User deleted successfully');
      } else {
          res.statusCode = 404;
          res.end('User not found');
      }
    }
  } else {
    res.statusCode = 400;
    res.end('Bad request');
  }
}

export default handleRequest;