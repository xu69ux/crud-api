import { UserNotFoundError, InvalidUserError } from './errors/userErrors';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { validateUser } from './validators/validateUser';
import { validateUpdateUser } from './validators/validateUpdateUser';
import { User } from './models/User';
import { v4 } from 'uuid';


let users: User[] = [];
const pathDB = 'db.json';

export function read(): void {
    if (existsSync(pathDB)) {
        const data = readFileSync(pathDB, 'utf-8');
        users = JSON.parse(data);
    } else {
        writeFileSync(pathDB, '[]');
        save();
    }
}

export function save(): void {
    const data = JSON.stringify(users);
    writeFileSync(pathDB, data);
}

export function getUsers(): User[] {
    read();
    return [...users];
}

export function getUserById(id: string): User | undefined {
    read();
    const user = users.find(user => user.id === id);
    if (!user) {
        throw new UserNotFoundError(id);
    }
    return user;
}

export function addUser(user: User): User {
    const validationError = validateUser(user);
    if (validationError) {
        throw new InvalidUserError(validationError);
    }
    read();
    const newUser = { ...user, id: v4() };
    users = [...users, newUser];
    save();
    return newUser;
}

export function updateUserById(id: string, updatedUser: User): User {
    const validationError = validateUpdateUser(updatedUser);
    if (validationError) {
        throw new InvalidUserError(validationError);
    }
    read();
    const index = users.findIndex(user => user.id === id);
    if (index === -1) {
        throw new UserNotFoundError(id);
    }
    const newUser = { ...users[index], ...updatedUser };
    users = [...users.slice(0, index), newUser, ...users.slice(index + 1)];
    save();
    return newUser;
}

export function deleteUserById(id: string): boolean {
    read();
    const index = users.findIndex(user => user.id === id);
    if (index === -1) {
        throw new UserNotFoundError(id);
    }
    users = [...users.slice(0, index), ...users.slice(index + 1)];
    save();
    return true;
}