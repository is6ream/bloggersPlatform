const user = {
  age: 18,
  showAge() {
    console.log(this.age);
  },
};

setTimeout(user.showAge.bind(user), 1000);
const animal = {
  age: 2,
  getMyAge: user.showAge,
};
animal.getMyAge();
