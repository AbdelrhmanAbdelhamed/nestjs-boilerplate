import { Test, TestingModule } from '@nestjs/testing';
import { UrlsRepository } from '../repositories';
import { Url } from '../schemas';
import { CACHE_MANAGER } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';

type CacheManagerMock = {
  get: jest.Mock;
  set: jest.Mock;
};

type UrlModelMock = {
  create: jest.Mock;
  findOne: jest.Mock;
};

describe('UrlsRepository', () => {
  let urlsRepository: UrlsRepository;
  let cacheManagerMock: CacheManagerMock;
  let urlModelMock: UrlModelMock;
  let url: Url;

  beforeEach(async () => {
    url = {
      encodeRequestCountry: 'OTHERS',
      totalClicks: 5,
      id: 'AEqzgnKpmj4LHDxoctDrHM',
      name: 'https://www.google.com',
      visits: [{ count: 5, country: 'OTHERS' }],
      createdAt: new Date('2022-02-09T01:12:04.457Z'),
      updatedAt: new Date('2022-02-09T01:12:27.777Z'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlsRepository,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(() => url),
            set: jest.fn(),
          },
        },
        {
          provide: getModelToken(Url.name),
          useValue: {
            create: jest.fn(() => url),
            findOne: jest.fn(() => url),
          },
        },
      ],
    }).compile();

    urlsRepository = module.get(UrlsRepository);
    cacheManagerMock = module.get(CACHE_MANAGER);
    urlModelMock = module.get(getModelToken(Url.name));
  });

  it('should be defined', async () => {
    expect(urlsRepository).toBeDefined();
  });

  describe('create functionality', () => {
    it('should be able to create and save a url with its short id', async () => {
      const result = await urlsRepository.create(url);

      expect(urlModelMock.create).toBeCalledWith(url);
      expect(result).toEqual(url);
    });
  });

  describe('findOneByKey functionality', () => {
    it('should be able to find a url by id from cache', async () => {
      const result = await urlsRepository.findOneByKey({ key: url.id });

      expect(cacheManagerMock.get).toBeCalledWith(url.id);
      expect(cacheManagerMock.set).not.toBeCalled();
      expect(result).toEqual(url);
    });

    it('should be able to find a url by name from cache', async () => {
      const result = await urlsRepository.findOneByKey({ key: url.name });

      expect(cacheManagerMock.get).toBeCalledWith(url.name);
      expect(cacheManagerMock.set).not.toBeCalled();
      expect(result).toEqual(url);
    });

    it('should be able to find a url by id from db', async () => {
      cacheManagerMock.get.mockReturnValue(undefined);
      const fetchOneByKeySpy = jest.spyOn(urlsRepository, 'fetchOneByKey');

      const result = await urlsRepository.findOneByKey({ key: url.id });

      expect(cacheManagerMock.get).toBeCalledWith(url.id);
      expect(fetchOneByKeySpy).toBeCalledWith({ key: url.id });
      expect(result).toEqual(url);
    });

    it('should be able to find a url by name from db', async () => {
      cacheManagerMock.get.mockReturnValue(undefined);
      const fetchOneByKeySpy = jest.spyOn(urlsRepository, 'fetchOneByKey');

      const result = await urlsRepository.findOneByKey({ key: url.name });

      expect(cacheManagerMock.get).toBeCalledWith(url.name);
      expect(fetchOneByKeySpy).toBeCalledWith({ key: url.name });
      expect(result).toEqual(url);
    });

    it('should return null if no url found by id in both db and cache', async () => {
      cacheManagerMock.get.mockReturnValue(undefined);
      const fetchOneByKeySpy = jest
        .spyOn(urlsRepository, 'fetchOneByKey')
        .mockReturnValue(Promise.resolve(null));

      const result = await urlsRepository.findOneByKey({ key: url.id });

      expect(cacheManagerMock.get).toBeCalledWith(url.id);
      expect(fetchOneByKeySpy).toBeCalledWith({ key: url.id });
      expect(result).toEqual(null);
    });

    it('should return null if no url found by name in both db and cache', async () => {
      cacheManagerMock.get.mockReturnValue(undefined);
      const fetchOneByKeySpy = jest
        .spyOn(urlsRepository, 'fetchOneByKey')
        .mockReturnValue(Promise.resolve(null));

      const result = await urlsRepository.findOneByKey({ key: url.name });

      expect(cacheManagerMock.get).toBeCalledWith(url.name);
      expect(fetchOneByKeySpy).toBeCalledWith({ key: url.name });
      expect(result).toEqual(null);
    });
  });

  describe('fetchOneByKey functionality', () => {
    it('should be able to find a url by id from db and update the cache', async () => {
      const result = await urlsRepository.fetchOneByKey({ key: url.id });

      expect(cacheManagerMock.set).toBeCalledWith(url.id, url, { ttl: 0 });

      expect(urlModelMock.findOne).toBeCalledWith({
        $or: [{ id: url.id }, { name: url.id }],
      });

      expect(result).toEqual(url);
    });

    it('should be able to find a url by name from db and update the cache', async () => {
      const result = await urlsRepository.fetchOneByKey({ key: url.name });

      expect(cacheManagerMock.set).toBeCalledWith(url.name, url, { ttl: 0 });

      expect(urlModelMock.findOne).toBeCalledWith({
        $or: [{ id: url.name }, { name: url.name }],
      });

      expect(result).toEqual(url);
    });

    it('should return null if no url found by id in db', async () => {
      urlModelMock.findOne.mockReturnValue(null);

      const result = await urlsRepository.fetchOneByKey({ key: url.id });

      expect(urlModelMock.findOne).toBeCalledWith({
        $or: [{ id: url.id }, { name: url.id }],
      });

      expect(cacheManagerMock.set).not.toBeCalled();
      expect(result).toEqual(null);
    });

    it('should return null if no url found by name in db', async () => {
      urlModelMock.findOne.mockReturnValue(null);

      const result = await urlsRepository.fetchOneByKey({ key: url.name });

      expect(urlModelMock.findOne).toBeCalledWith({
        $or: [{ id: url.name }, { name: url.name }],
      });

      expect(cacheManagerMock.set).not.toBeCalled();
      expect(result).toEqual(null);
    });
  });
});
