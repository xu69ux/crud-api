import { User } from '../models/User';

export function validateUpdateUser(user: Partial<User>): string | null {
  if (user.username !== undefined && typeof user.username !== 'string') {
    return 'Username must be a string';
  }

  if (user.age !== undefined && typeof user.age !== 'number') {
    return 'Age must be a number';
  }

  if (user.hobbies !== undefined && (!Array.isArray(user.hobbies) || !user.hobbies.every(hobby => typeof hobby === 'string'))) {
    return 'Hobbies must be an array of strings';
  }

  return null;
}
