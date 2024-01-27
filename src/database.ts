import { User } from './models/User';

let users: User[] = [
    {
        id: 1,
        username: 'xu',
        age: 31,
        hobbies: ['reading', 'coding', 'yoga']
    },
    {
        id: 2,
        username: 'uisky',
        age: 44,
        hobbies: ['eat', 'sleep', 'vodka']
    }
];

export function getUsers(): User[] {
    return users;
}

export function addUser(user: User): void {
    users.push(user);
}