import {inject, injectable, interfaces} from 'inversify';
import {Collection, MongoClient} from 'mongodb';
import {DomainLogo} from '../models/domain-logo.model';
import Provider = interfaces.Provider;

@injectable()
export class DomainLogoRepository {
  private static readonly collectionName = 'domain-logo';
  private readonly mongoClientProvider: Provider<MongoClient>;

  constructor(@inject(MongoClient) mongoClientProvider: Provider<MongoClient>) {
    this.mongoClientProvider = mongoClientProvider;
  }

  async insert(domainLogo: DomainLogo): Promise<void> {
    const collection = await this.collection();
    await collection.insertOne(domainLogo);
  }

  async findByDomain(domain: string): Promise<DomainLogo | null> {
    const collection = await this.collection();
    return collection.findOne({domain: domain});
  }

  private async collection(): Promise<Collection<DomainLogo>> {
    const mongoClient = (await this.mongoClientProvider()) as MongoClient;
    return mongoClient.db().collection(DomainLogoRepository.collectionName);
  }
}
