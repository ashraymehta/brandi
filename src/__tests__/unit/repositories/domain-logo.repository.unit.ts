import 'reflect-metadata';
import {expect} from 'chai';
import {DomainLogo} from '../../../models/domain-logo.model';
import {setupTestDatabase} from '../../acceptance/test-helper';
import {DomainLogoRepository} from '../../../repositories/domain-logo.repository';

describe(DomainLogoRepository.name, () => {
  let domainLogoRepository: DomainLogoRepository;

  beforeEach(async () => {
    const mongoClient = await setupTestDatabase();
    domainLogoRepository = new DomainLogoRepository(mongoClient);
  });

  it('should save and retrieve domain logo to repository', async () => {
    const domain = 'www.google.com';
    const domainLogo = new DomainLogo(domain, 'https://some-url.com/');

    await domainLogoRepository.insert(domainLogo);
    const foundDomainLogo = await domainLogoRepository.findByDomain(domain);

    expect(foundDomainLogo).to.deep.equal(domainLogo);
  });

  it('should retrieve null if no domain logo is found for a domain', async () => {
    const domain = 'www.google.com';

    const foundDomainLogo = await domainLogoRepository.findByDomain(domain);

    expect(foundDomainLogo).to.be.null;
  });
});
