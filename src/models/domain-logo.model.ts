export class DomainLogo {
  public readonly domain: string;
  public readonly logoUrl: string;
  public readonly mimeType: string;

  constructor(domain: string, logoUrl: string, mimeType: string) {
    this.domain = domain;
    this.logoUrl = logoUrl;
    this.mimeType = mimeType;
  }
}
