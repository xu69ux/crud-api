export class UserNotFoundError extends Error {
  constructor(id: string) {
      super(`User with id ${id} not found`);
      this.name = 'UserNotFoundError';
  }
}

export class InvalidUserError extends Error {
  constructor(message: string) {
      super(message);
      this.name = 'InvalidUserError';
  }
}