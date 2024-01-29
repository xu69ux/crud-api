import { readFileSync, writeFileSync, existsSync } from 'fs';
import { User } from './models/User';
import { v4 } from 'uuid';


let users: User[] = [];

export function init(): void {
    if (!existsSync('db.json')) {
        writeFileSync('db.json', JSON.stringify([]));
    }

    const data = readFileSync('db.json', 'utf-8');
    users = JSON.parse(data);
}

export function save(): void {
    const data = JSON.stringify(users);
    writeFileSync('db.json', data);
}

export function getUsers(): User[] {
    return [...users];
}

export function getUserById(id: string): User | undefined {
    const user = users.find(user => user.id === id);
    if (!user) {
        throw new Error(`User with id ${id} not found`);
    }
    return user;
}

export function addUser(user: User): void {
    const newUser = { ...user, id: v4() };
    users = [...users, newUser];
    save();
}

export function updateUser(id: string, updatedUser: User): User {
    const index = users.findIndex(user => user.id === id);
    if (index === -1) {
        throw new Error(`User with id ${id} not found`);
    }
    const newUser = { ...users[index], ...updatedUser };
    users = [...users.slice(0, index), newUser, ...users.slice(index + 1)];
    save();
    return newUser;
}

export function deleteUser(id: string): boolean {
    const index = users.findIndex(user => user.id === id);
    if (index === -1) {
        throw new Error(`User with id ${id} not found`);
    }
    users = [...users.slice(0, index), ...users.slice(index + 1)];
    save();
    return true;
}