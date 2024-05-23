import { SetMetadata } from '@nestjs/common';

export const jwtConstants = {
  secret:
    'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.',
};
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const accessTokenConstant = {
  secret: 'SECRET KEY FOR ACCESS TOKEN',
};

export const PASSWORD_ENCRYPTION = {
  SALT_ROTATION: 12,
};
