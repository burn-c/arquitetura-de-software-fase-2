export interface AddressDTO {
  street: string;
  number: string;
  city: string;
  state: string;
  zipCode: string;
}

export class Address implements AddressDTO {
  street: string;
  number: string;
  city: string;
  state: string;
  zipCode: string;
  constructor(data: AddressDTO) {
    this.street = data.street;
    this.number = data.number;
    this.city = data.city;
    this.state = data.state;
    this.zipCode = data.zipCode;
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
