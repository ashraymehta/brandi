import {inject, injectable, interfaces} from 'inversify';
import {Collection, MongoClient} from 'mongodb';
import {Brand} from '../models/brand.model';
import Provider = interfaces.Provider;

@injectable()
export class BrandRepository {
  private static readonly collectionName = 'brand';
  private readonly mongoClientProvider: Provider<MongoClient>;

  constructor(@inject(MongoClient) mongoClientProvider: Provider<MongoClient>) {
    this.mongoClientProvider = mongoClientProvider;
  }

  async insert(domainLogo: Brand): Promise<void> {
    const collection = await this.collection();
    await collection.insertOne(domainLogo);
  }

  async findByDomain(domain: string): Promise<Brand | null> {
    const collection = await this.collection();
    return collection.findOne({domain: domain});
  }

  private async collection(): Promise<Collection<Brand>> {
    const mongoClient = (await this.mongoClientProvider()) as MongoClient;
    return mongoClient.db().collection(BrandRepository.collectionName);
  }
}
