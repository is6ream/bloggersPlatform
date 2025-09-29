export function getAuthCredentials() {
  return {
    loginOrEmail: "test",
    password: "test1234567",
  };
}
export function getRegisterCredentials() {
  return {
    login: "test",
    email: "test@mail.ru",
    password: "test123456",
  };
}

export function getUniqueCredentials() {
  return {
    login: `${new Date().getTime()}login`,
    email: `${new Date().getTime()}@mail.ru`,
    password: `${new Date().getTime()}pass`,
  };
}
