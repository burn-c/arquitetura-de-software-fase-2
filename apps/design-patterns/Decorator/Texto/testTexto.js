const Texto = require("./Texto");
const NegritoDecorator = require("./NegritoDecorator");
const ItalicoDecorator = require("./ItalicoDecorator");
const SublinhadoDecorator = require("./SublinhadoDecorator");

let texto = new Texto("Hello, Rocket!")

texto = new NegritoDecorator(new ItalicoDecorator(texto))

texto = new SublinhadoDecorator(texto)

console.log(texto.renderizar())
