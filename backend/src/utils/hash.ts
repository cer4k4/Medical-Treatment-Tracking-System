import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;
export const hash = (plain: string) => bcrypt.hash(plain, SALT_ROUNDS);
export const compare = (plain: string, hashed: string) => bcrypt.compare(plain, hashed);