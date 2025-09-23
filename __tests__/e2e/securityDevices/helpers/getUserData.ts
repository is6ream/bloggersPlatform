export function getUserData(deviceName: string) {
  let userAgent: string = "";

  switch (deviceName) {
    case "iphone":
      userAgent = "iphone11";
      break;
    case "huawei D16":
      userAgent = "huawei D16";
      break;
    case "Macbook":
      userAgent = "Macbook";
      break;
    case "redmi 8":
      userAgent = "redmi 8";
      break;
  }

  return {
    login: "test",
    email: "test@mail.ru",
    password: "test",
    userAgent: userAgent,
  };
}
