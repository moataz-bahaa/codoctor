import bcrypt from 'bcryptjs';

export const hash = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = (password, hash) => {
  return bcrypt.compare(password, hash);
};
