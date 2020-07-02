import {injectable} from 'inversify';
import {Collection, MongoClient} from 'mongodb';
import {DomainLogo} from '../models/domain-logo.model';

@injectable()
export class DomainLogoRepository {
  private static readonly collectionName = 'domain-logo';
  private readonly mongoClient: MongoClient;

  constructor(mongoClient: MongoClient) {
    this.mongoClient = mongoClient;
  }

  async insert(domainLogo: DomainLogo): Promise<void> {
    await this.collection().insertOne(domainLogo);
  }

  findByDomain(domain: string): Promise<DomainLogo | null> {
    return this.collection().findOne({domain: domain});
  }

  private collection(): Collection<DomainLogo> {
    return this.mongoClient
      .db()
      .collection(DomainLogoRepository.collectionName);
  }
}
