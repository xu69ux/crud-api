import { parse } from 'url';
import { getUsers, getUserById, addUser, updateUserById, deleteUserById } from '../database';
import { UserNotFoundError, InvalidUserError } from '../errors/userErrors';
import { validate as validateUuid } from 'uuid';
import { IncomingMessage, ServerResponse } from 'http';

function handleInternalServerError(res: ServerResponse) {
  res.statusCode = 500;
  res.end('Internal server error');
}

export function handleRequest(req: IncomingMessage, res: ServerResponse) {
  if (req.url) {
    const { pathname } = parse(req.url, true);
    if (pathname === '/users' && req.method === 'GET') {
      try {
          const users = getUsers();
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ message: 'All users:', users }));
      } catch (error) {
          res.statusCode = 500;
          res.end('Internal server error');
      }
    }
    if (pathname?.startsWith('/users/') && req.method === 'GET') {
      const id = pathname.split('/')[2];
      if (!validateUuid(id)) {
          res.statusCode = 400;
          res.end('Invalid user ID');
          return;
      }
      try {
          const user = getUserById(id);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ message: 'User found:', user }));
      } catch (error) {
          if (error instanceof UserNotFoundError) {
              res.statusCode = 404;
              res.end(`User with id ${id} not found`);
          } else {
            handleInternalServerError(res);
          }
      }
    }
    if (pathname === '/users' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          const user = JSON.parse(body);
          const newUser = addUser(user);
          res.statusCode = 201;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ message: 'User created successfully', user: newUser}));
        } catch (error) {
          if (error instanceof InvalidUserError) {
            res.statusCode = 400;
            res.end('Invalid user data: ' + error.message);
          } else {
            handleInternalServerError(res);
          }
        }
      });
    }
    
    if (pathname?.startsWith('/users/') && req.method === 'PUT') {
      const id = pathname.split('/')[2];
      if (!validateUuid(id)) {
        res.statusCode = 400;
        res.end('Invalid user ID');
        return;
      }
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          const user = JSON.parse(body);
          const updatedUser = updateUserById(id, user);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ message: `User updated successfully: ` + JSON.stringify(updatedUser) }));
        } catch (error) {
          if (error instanceof UserNotFoundError) {
            res.statusCode = 404;
            res.end(`User with id ${id} not found`);
          } else if (error instanceof InvalidUserError){
            res.statusCode = 400;
            res.end('Invalid user data: ' + error.message);
          } else {
            handleInternalServerError(res);
          }
        }
      });
    }
    
    if (pathname?.startsWith('/users/') && req.method === 'DELETE') {
      const id = pathname.split('/')[2];
      if (!validateUuid(id)) {
        res.statusCode = 400;
        res.end('Invalid user ID');
        return;
      }
      try {
        deleteUserById(id);
        res.statusCode = 204;
        res.setHeader('Content-Type', 'application/json');
        res.end('User deleted successfully');
      } catch (error) {
        if (error instanceof UserNotFoundError) {
          res.statusCode = 404;
          res.end(`User with id ${id} not found`);
        } else {
          handleInternalServerError(res);
        }
      }
    }
  }
};

export default handleRequest;