import {OAuth2Client} from 'google-auth-library';

export class GoogleSignInTokenVerifier {
  private readonly clientId: string;
  private readonly client: OAuth2Client;

  constructor(clientId: string, oauth2Client: OAuth2Client) {
    this.clientId = clientId;
    this.client = oauth2Client;
  }

  public async verify(token: string): Promise<void> {
    await this.client.verifyIdToken({
      idToken: token,
      audience: this.clientId,
    });
  }
}
