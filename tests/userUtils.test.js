const { isValidEmail, isStrongPassword } = require('../utils/userUtils');

describe('Validação de email', () => {
  test('email válido retorna true', () => {
    expect(isValidEmail('teste@email.com')).toBe(true);
  });

  test('email inválido retorna false', () => {
    expect(isValidEmail('testeemail.com')).toBe(false);
  });
});

describe('Validação de senha', () => {
  test('senha forte retorna true', () => {
    expect(isStrongPassword('12345678')).toBe(true);
  });

  test('senha fraca retorna false', () => {
    expect(isStrongPassword('123')).toBe(false);
  });
});
