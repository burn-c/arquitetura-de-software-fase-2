class PizzaDirector {
  constructor(builder) {
    this.builder = builder;
  }

  makeMargherita() {
    return this.builder
      .setSize("grande")
      .setCrust("fina")
      .addCheese()
      .addTopping("tomate")
      .addTopping("manjericão")
      .build()
  }

  makePepperoni() {
    return this.builder
      .addTopping("pepperoni")
      .build()
  }
}

module.exports = PizzaDirector