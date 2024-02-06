import jwt, { SignOptions } from 'jsonwebtoken';
import customConfig from '../config/jwt';

export const signJwt = (
  payload: object,
  key: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
  options: SignOptions = {}
) => {
  const privateKey = Buffer.from(customConfig[key], 'base64').toString('ascii');
  const signOptions: SignOptions = {
    ...(options || {}),
    algorithm: 'RS256',
  };

  return jwt.sign(payload, privateKey, signOptions);
};