import {URL} from 'url';
import {injectable} from 'inversify';
import {customsearch_v1} from 'googleapis';
import {getLogger} from '../utils/logger.util';
import {ConfigUtil} from '../utils/config.util';
import Customsearch = customsearch_v1.Customsearch;

@injectable()
export class GoogleSearchService {
  private readonly configUtil: ConfigUtil;
  private readonly customSearch: Customsearch;
  private readonly logger = getLogger(GoogleSearchService.name);

  constructor(customSearch: Customsearch, configUtil: ConfigUtil) {
    this.customSearch = customSearch;
    this.configUtil = configUtil;
  }

  public async findWebsite(query: string): Promise<URL | undefined> {
    this.logger.info(`Querying Google search for: ${query}`);
    const response = await this.customSearch.cse.list({
      q: query,
      cx: await this.configUtil.getGoogleSearchEngineId(),
    });
    if (response.data.items) {
      const url = new URL(response.data.items[0].link as string);
      this.logger.info(`Found [${url.toString()}] as the top result for [${query}].`);
      return url;
    } else {
      this.logger.info(`Could not find a website for query [${query}].`);
      return undefined;
    }
  }
}
