import {URL} from 'url';
import {expect} from 'chai';
import {GaxiosResponse} from 'gaxios';
import {customsearch_v1} from 'googleapis';
import {ConfigUtil} from '../../../utils/config.util';
import {GoogleSearchService} from '../../../services';
import {deepEqual, instance, mock, when} from 'ts-mockito';
import Customsearch = customsearch_v1.Customsearch;
import Resource$Cse = customsearch_v1.Resource$Cse;
import Schema$Search = customsearch_v1.Schema$Search;

describe(GoogleSearchService.name, function () {
  const configUtil = mock(ConfigUtil);
  const customsearch = mock(Customsearch);
  const googleSearchService = new GoogleSearchService(instance(customsearch), instance(configUtil));

  it('should find website for query', async function () {
    const query = 'a-query';
    const resourceCse = mock(Resource$Cse);
    const searchEngineId = 'search-engine-id';
    const firstResultUrl = 'https://a-result.com/a/path/on/the/website';
    const searchResponse = {
      data: {
        items: [{link: firstResultUrl}, {link: 'https://another-result.com/'}],
      },
    } as GaxiosResponse<Schema$Search>;
    when(customsearch.cse).thenReturn(instance(resourceCse));
    when(configUtil.getGoogleSearchEngineId()).thenResolve(searchEngineId);
    when(resourceCse.list(deepEqual({q: query, cx: searchEngineId}))).thenResolve(searchResponse);

    const url = await googleSearchService.findWebsite(query);

    expect(url).to.deep.equal(new URL(firstResultUrl));
  });

  it('should return undefined when no website is found for query', async function () {
    const query = 'a-query';
    const resourceCse = mock(Resource$Cse);
    const searchEngineId = 'search-engine-id';
    const searchResponse = {data: {}} as GaxiosResponse<Schema$Search>;
    when(customsearch.cse).thenReturn(instance(resourceCse));
    when(configUtil.getGoogleSearchEngineId()).thenResolve(searchEngineId);
    when(resourceCse.list(deepEqual({q: query, cx: searchEngineId}))).thenResolve(searchResponse);

    const url = await googleSearchService.findWebsite(query);

    expect(url).to.be.undefined;
  });
});
