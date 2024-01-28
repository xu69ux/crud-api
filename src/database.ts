import { User } from './models/User';
import { v4 } from 'uuid';


let users: User[] = [
    {
        id: 'fc008863-aefb-4d8b-a015-ae58ab28f535',
        username: 'xu',
        age: 31,
        hobbies: ['reading', 'coding', 'yoga']
    },
    {
        id: '64d45374-adbe-423a-ac6c-a84d3cf9108f',
        username: 'uisky',
        age: 44,
        hobbies: ['eat', 'sleep', 'vodka']
    }
];

export function getUsers(): User[] {
    return users;
}

export function getUserById(id: string): User | undefined {
    return users.find(user => user.id === id);
}

export function addUser(user: User): void {
    user.id = v4();
    users.push(user);
}

export function updateUser(id: string, updatedUser: User): User | undefined {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedUser };
      return users[index];
    }
    return undefined;
  }