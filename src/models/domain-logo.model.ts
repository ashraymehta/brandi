export class DomainLogo {
  public readonly domain: string;
  public readonly logoKey: string;
  public readonly contentType: string;

  constructor(domain: string, logoKey: string, contentType: string) {
    this.domain = domain;
    this.logoKey = logoKey;
    this.contentType = contentType;
  }
}
