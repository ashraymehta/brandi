export class DomainLogo {
  public readonly domain: string;
  public readonly logoUrl: string;
  public readonly contentType: string;

  constructor(domain: string, logoUrl: string, contentType: string) {
    this.domain = domain;
    this.logoUrl = logoUrl;
    this.contentType = contentType;
  }
}
