import { jwtVerify } from "jose";

interface UserJwtPayload {
  jti: string;
  iat: number;
}

export function getJwtSecretKey(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length === 0 ) {
    throw new Error("JWT secret key is not defined");
  }

  return secret;
}

export const verifyAuth = async (token: string) => {
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(getJwtSecretKey())
    );

  } catch (error) {
    throw new Error("Your token is invalid");
  }

  return token
};

export function getNextJwtSecretKey(): string {
  const nextAuthSecret = process.env.NEXTAUTH_SECRET;
  if (!nextAuthSecret || nextAuthSecret.length === 0 ) {
    throw new Error("JWT nextAuthSecret key is not defined");
  }

  return nextAuthSecret;
}

export const verifyNextAuth = async (token: string) => {
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(getJwtSecretKey())
    );
  } catch (error) {
    throw new Error("Your user token is invalid");
  }

  return token
};

