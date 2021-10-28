const user = {
  name: "Adithya",
};

class Adam {
  constructor(data) {
    this.data = data;
  }

  addAge = () => {
    this.data.age = 18;
  };
}

const a = new Adam(user);
a.addAge();
console.log(user);
