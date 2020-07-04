import 'reflect-metadata';
import {expect} from 'chai';
import {Brand} from '../../../models/brand.model';
import {setupTestDatabase} from '../../acceptance/test-helper';
import {BrandRepository} from '../../../repositories/brand.repository';

describe(BrandRepository.name, () => {
  let domainLogoRepository: BrandRepository;

  beforeEach(async () => {
    const mongoClient = await setupTestDatabase();
    domainLogoRepository = new BrandRepository(() => Promise.resolve(mongoClient));
  });

  it('should save and retrieve brand from repository', async () => {
    const name = 'Google';
    const domain = 'www.google.com';
    const domainLogo = new Brand(name, domain, 'https://some-url.com/');

    await domainLogoRepository.insert(domainLogo);
    const foundDomainLogo = await domainLogoRepository.findByName(name);

    expect(foundDomainLogo).to.deep.equal(domainLogo);
  });

  it('should retrieve null if no domain logo is found for a domain', async () => {
    const name = 'Google';

    const foundDomainLogo = await domainLogoRepository.findByName(name);

    expect(foundDomainLogo).to.be.null;
  });
});
