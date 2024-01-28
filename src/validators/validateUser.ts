import { User } from '../models/User';

export function validateUser(user: User): string | null {
  if (!user.username || user.age === undefined || !user.hobbies) {
    return 'Missing required fields';
  }
  
  if (typeof user.username !== 'string') {
    return 'Username must be a string';
  }

  if (typeof user.age !== 'number') {
    return 'Age must be a number';
  }

  if (!Array.isArray(user.hobbies) || !user.hobbies.every(hobby => typeof hobby === 'string')) {
    return 'Hobbies must be an array of strings';
  }

  return null;
}