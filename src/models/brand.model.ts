export class Brand {
  public readonly name: string;
  public readonly domain: string;
  public readonly logoKey: string;

  constructor(name: string, domain: string, logoKey: string) {
    this.name = name;
    this.domain = domain;
    this.logoKey = logoKey;
  }
}
