class Person {
  constructor(name, age) {
    this._name = name; //приватное поле
    this._age = age; //приватное поле
  }

  //Public getter
  getName() {
    return this._name;
  }

  //Public setter
  setName(newName) {
    this._name = newName;
  }

  //Private metod
  _calculateSalary() {
    return this._age * 1000;
  }

  //Public method
  getSalary() {
    return this._calculateSalary();
  }
}

const person = new Person("Alice", 40);
console.log(person.getName());
person.setName("Bob");
console.log(person.getName());
console.log(person.getSalary());
