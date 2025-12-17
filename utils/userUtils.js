const isValidEmail = (email) =>
  typeof email === 'string' && email.includes('@');

const isStrongPassword = (password) =>
  typeof password === 'string' && password.length >= 8;

module.exports = {
  isValidEmail,
  isStrongPassword
};
