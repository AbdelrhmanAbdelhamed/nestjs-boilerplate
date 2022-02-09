import { Request } from 'express';
import { getClientIp } from 'request-ip';
import { lookup as getGeo } from 'geoip-country';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RequestCountry = createParamDecorator(
  (
    data: { defaultIp?: string; defaultCountry?: string } = {},
    context: ExecutionContext,
  ) => {
    const request = context.switchToHttp().getRequest();
    return requestCountry(data.defaultIp || request) || data?.defaultCountry;
  },
);

function requestCountry(ipOrRequest: string | Request): string | undefined {
  if (!ipOrRequest) return undefined;

  const ip =
    typeof ipOrRequest === 'string'
      ? ipOrRequest
      : getClientIp(ipOrRequest) || '';

  return getGeo(ip)?.country;
}
