import { Test, TestingModule } from '@nestjs/testing';
import { UrlsService } from '.';
import { UrlsRepository } from '../repositories';
import { UrlDecodeDto, UrlEncodeDto } from '../dtos';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { getIdentifierCreatorToken } from '../utils';
import { UrlDecodedEvent, URL_DECODED_EVENT_KEY } from '../events';
import { Url } from '../schemas';
import { NotFoundException } from '@nestjs/common';
import { IdentifierCreatorProvider } from '../providers';
import { IdentifierCreator } from '../models';

type UrlsRepositoryMock = {
  create: jest.Mock;
  findOneByKey: jest.Mock;
  fetchOneByKey: jest.Mock;
};

type EventEmitterMock = {
  emit: jest.Mock;
  emitAsync: jest.Mock;
};

describe('UrlsService', () => {
  let urlsService: UrlsService;
  let urlsRepositoryMock: UrlsRepositoryMock;
  let urlEncodeDto: UrlEncodeDto;
  let urlDecodeDto: UrlDecodeDto;
  let identifierCreator: IdentifierCreator;
  let eventEmitterMock: EventEmitterMock;
  let url: Url;
  let createdId: string;
  let requestCountry: string;

  beforeEach(async () => {
    createdId = '559WLYubxkoB7PmkvJeHUi';
    requestCountry = 'OTHERS';
    url = {
      encodeRequestCountry: 'OTHERS',
      totalClicks: 5,
      id: 'AEqzgnKpmj4LHDxoctDrHM',
      name: 'https://www.google.com',
      visits: [{ count: 5, country: 'OTHERS' }],
      createdAt: new Date('2022-02-09T01:12:04.457Z'),
      updatedAt: new Date('2022-02-09T01:12:27.777Z'),
    };

    urlEncodeDto = {
      urlName: url.name,
    };

    urlDecodeDto = {
      id: url.id,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlsService,
        {
          provide: UrlsRepository,
          useValue: {
            create: jest.fn(),
            findOneByKey: jest.fn(() => url),
            fetchOneByKey: jest.fn(() => url),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
            emitAsync: jest.fn(),
          },
        },
        IdentifierCreatorProvider,
      ],
    }).compile();

    urlsService = module.get(UrlsService);
    urlsRepositoryMock = module.get(UrlsRepository);
    identifierCreator = module.get(getIdentifierCreatorToken());
    eventEmitterMock = module.get(EventEmitter2);
  });

  it('should be defined', async () => {
    expect(urlsService).toBeDefined();
  });

  describe('encode functionality', () => {
    it('should be able to encode long url and return its created id', async () => {
      urlsRepositoryMock.findOneByKey.mockReturnValue(null);

      jest
        .spyOn(identifierCreator, 'create')
        .mockImplementation(() => createdId);

      const result = await urlsService.encode({
        ...urlEncodeDto,
        requestCountry: requestCountry,
      });

      expect(urlsRepositoryMock.findOneByKey).toBeCalledWith({
        key: urlEncodeDto.urlName,
      });

      expect(identifierCreator.create).toBeCalled();

      expect(urlsRepositoryMock.create).toBeCalledWith({
        id: createdId,
        name: urlEncodeDto.urlName,
        encodeRequestCountry: requestCountry,
      });

      expect(result).toEqual({
        id: createdId,
      });
    });

    it('should be able to return already existing encoded url id', async () => {
      const result = await urlsService.encode({
        ...urlEncodeDto,
        requestCountry: requestCountry,
      });

      expect(urlsRepositoryMock.findOneByKey).toBeCalledWith({
        key: urlEncodeDto.urlName,
      });

      expect(jest.spyOn(identifierCreator, 'create')).not.toBeCalled();
      expect(urlsRepositoryMock.create).not.toBeCalled();
      expect(result).toEqual({
        id: url.id,
      });
    });
  });

  describe('decode functionality', () => {
    it('should be able to decode url id and return its long url', async () => {
      const result = await urlsService.decode({
        ...urlDecodeDto,
        requestCountry: requestCountry,
      });

      expect(urlsRepositoryMock.findOneByKey).toBeCalledWith({
        key: urlDecodeDto.id,
      });

      expect(eventEmitterMock.emitAsync).toBeCalledWith(
        URL_DECODED_EVENT_KEY,
        new UrlDecodedEvent({
          id: url.id,
          name: url.name,
          visitCountry: url.encodeRequestCountry as string,
        }),
      );

      expect(result).toEqual({
        url: url.name,
      });
    });

    it('should throw an not found exception if there no url found', async () => {
      urlsRepositoryMock.findOneByKey.mockReturnValue(null);

      expect(() =>
        urlsService.decode({
          ...urlDecodeDto,
          requestCountry: 'OTHERS',
        }),
      ).rejects.toThrow(NotFoundException);

      expect(urlsRepositoryMock.findOneByKey).toBeCalledWith({
        key: urlDecodeDto.id,
      });

      expect(eventEmitterMock.emitAsync).not.toBeCalled();
    });
  });

  describe('decode Statistics', () => {
    it('should be able to return some url statistics', async () => {
      const result = await urlsService.getStatistics({
        id: url.id,
      });

      expect(urlsRepositoryMock.fetchOneByKey).toBeCalledWith({ key: url.id });
      expect(result).toEqual({
        totalClicks: url.totalClicks,
        visits: url.visits,
      });
    });

    it('should throw an not found exception if there no url found', async () => {
      urlsRepositoryMock.fetchOneByKey.mockReturnValue(null);

      expect(() =>
        urlsService.getStatistics({
          id: url.id,
        }),
      ).rejects.toThrow(NotFoundException);
      expect(urlsRepositoryMock.fetchOneByKey).toBeCalledWith({ key: url.id });
    });
  });
});
