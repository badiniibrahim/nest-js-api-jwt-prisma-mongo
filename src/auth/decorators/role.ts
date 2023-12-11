import { SetMetadata } from '@nestjs/common';

export enum UserRole {
  ADMIN,
  USER,
}
export const ROLE_KEY = 'role';
export const Role = (role: UserRole) => SetMetadata(ROLE_KEY, role);
