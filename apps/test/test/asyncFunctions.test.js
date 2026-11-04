import { expect } from "chai";
import { fetchData, fetchDataPromise } from "../src/asyncFunctions.js";

describe('Função fetchData com async/await', () => {
  it('deve retornar "dados recebidos"', async () => {
    const resultado = await fetchDataPromise();
    expect(resultado).to.equal('dados recebidos');
  });
});