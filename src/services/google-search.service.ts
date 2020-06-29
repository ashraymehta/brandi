import {URL} from 'url';
import {injectable} from 'inversify';
import {customsearch_v1} from 'googleapis';
import {getLogger} from '../utils/logger.util';
import Customsearch = customsearch_v1.Customsearch;

@injectable()
export class GoogleSearchService {
  private readonly customSearch: Customsearch;
  private readonly logger = getLogger(GoogleSearchService.name);

  constructor(customSearch: Customsearch) {
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
