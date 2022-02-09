import { getIdentifierCreatorToken } from '../utils';
import * as uuidBase58 from 'uuid-base58';
import { IdentifierCreator } from '../models';

function IdentifierCreatorFactory(): IdentifierCreator {
  return {
    create: () => uuidBase58.uuid58(),
  };
}

export const IdentifierCreatorProvider = {
  provide: getIdentifierCreatorToken(),
  useFactory: IdentifierCreatorFactory,
};
