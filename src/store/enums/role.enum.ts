export enum ERole {
  User = 'user',
  Admin = 'admin',
  Guest = 'guest',
}

export const roleHierarchy = {
  [ERole.Guest]: [ERole.Guest, ERole.User, ERole.Admin],
  [ERole.User]: [ERole.User, ERole.Admin],
  [ERole.Admin]: [ERole.Admin],
};
