import { Inject } from '@nestjs/common';
import { getIdentifierCreatorToken } from '../utils';

export const InjectIdentifierCreatorToken = () => {
  return Inject(getIdentifierCreatorToken());
};
