import {URL} from 'url';
import {customsearch_v1} from 'googleapis';
import {bind, BindingScope, inject} from '@loopback/core';
import {DependencyInjectionKeys} from '../utils/dependency-injection.keys';
import {getLogger} from '../utils/logger.util';
import Customsearch = customsearch_v1.Customsearch;

@bind({scope: BindingScope.TRANSIENT})
export class GoogleSearchService {
  private readonly customSearch: Customsearch;
  private readonly logger = getLogger(GoogleSearchService.name);

  constructor(
    @inject(DependencyInjectionKeys.CUSTOM_SEARCH) customSearch: Customsearch,
  ) {
    this.customSearch = customSearch;
  }

  public async findWebsite(query: string): Promise<URL | undefined> {
    this.logger.info(`Querying Google search for: ${query}`);
    const response = await this.customSearch.cse.list({q: query});
    return response.data.items
      ? new URL(response.data.items[0].link as string)
      : undefined;
  }
}
