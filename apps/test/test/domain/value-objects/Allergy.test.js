import { expect } from "chai";
import { Allergy } from "../../../src/domain/value-objects/Allergy.js";

describe("Allergy", () => {
  it("should create an allergy with valid data", () => {
    const allergy = new Allergy("Peanuts");

    expect(allergy.name).to.equal("Peanuts");
  });

  it("should throw an error when creating an allergy without a name", () => {
    expect(() => new Allergy("")).to.throw("Allergy name is required");
  });

  it("should be equal when both allergies have the same name", () => {
    expect(new Allergy("Peanuts").equals(new Allergy("Peanuts"))).to.be.true;
  });

  it("should not be equal when the names differ", () => {
    expect(new Allergy("Peanuts").equals(new Allergy("Dust"))).to.be.false;
  });

  it("should not be equal when compared to another kind of object", () => {
    expect(new Allergy("Peanuts").equals({ name: "Peanuts" })).to.be.false;
  });
});
