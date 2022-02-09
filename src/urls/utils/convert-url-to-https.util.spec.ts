import { convertUrlToHttps } from '../utils';

describe('UrlsService', () => {
  const testUrls = [
    { given: 'www.google.com', expected: 'https://www.google.com' },
    { given: 'google.com', expected: 'https://google.com' },
    { given: '//google.com', expected: 'https://google.com' },
    { given: 'http://www.google.com', expected: 'https://www.google.com' },
    { given: 'https://www.google.com', expected: 'https://www.google.com' },
    { given: 'ftp://www.google.com', expected: 'ftp://www.google.com' },
    { given: '', expected: false },
    { given: undefined, expected: false },
    { given: null, expected: false },
    { given: false, expected: false },
  ];

  it('should be defined', async () => {
    expect(convertUrlToHttps).toBeDefined();
  });

  testUrls.forEach((testUrl) => {
    it(`should convert ${testUrl.given}`, async () => {
      expect(convertUrlToHttps(testUrl.given as any)).toEqual(testUrl.expected);
    });
  });
});
