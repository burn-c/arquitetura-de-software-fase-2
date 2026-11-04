import { expect } from "chai";
import { fetchData, fetchDataPromise } from "../src/asyncFunctions.js";

describe('Função fetchData com async/await', () => {
  it('deve retornar "dados recebidos"', async () => {
    const resultado = await fetchDataPromise();
    expect(resultado).to.equal('dados recebidos');
  });
});

describe("fetchData", () => {
  it("deve retornar os dados recebidos via callback", (done) => {
    fetchData((resultado) => {
      expect(resultado).to.equal("dados recebidos");
      done();
    });
  });
});

describe("fetchDataPromise", () => {
  it("deve retornar os dados recebidos ao resolver a promise", () => {
    return fetchDataPromise().then((resultado) => {
      expect(resultado).to.equal("dados recebidos");
    });
  });
});
