export interface AddressDTO {
  readonly street: string;
  readonly number: string;
  readonly city: string;
  readonly state: string;
  readonly zipCode: string;
}

export class Address implements AddressDTO {
  readonly street: string;
  readonly number: string;
  readonly city: string;
  readonly state: string;
  readonly zipCode: string;

  constructor(data: AddressDTO) {
    this.street = data.street;
    this.number = data.number;
    this.city = data.city;
    this.state = data.state;
    this.zipCode = data.zipCode;

    // Imutabilidade em runtime: depois de criado, o objeto não aceita reatribuição
    // nem novos atributos. O `readonly` acima garante o mesmo em tempo de compilação.
    Object.freeze(this);
  }

  equals(otherAddress: Address): boolean {
    return (
      this.street === otherAddress.street &&
      this.number === otherAddress.number &&
      this.city === otherAddress.city &&
      this.state === otherAddress.state &&
      this.zipCode === otherAddress.zipCode
    );
  }
}
