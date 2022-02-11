# NestJS Boilerplate

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository implementing a shortening url service.

## How to use

1. git clone the repo
2. Install mkcert, docker and docker-compose in your machine
3. `cd` into the root directory and run the installer script `./install.sh`
4. Now you can reach the api by access nginx gateway through `https://shortening.local.com/` (PORT 80)
5. Configurations can be found in `.env.local` (root directory)

## Features

1. Full development environment out of the box using `docker` and `docker-compose`
2. Mongodb as persistence layer
3. Redis as cache layer
4. Full code coverage unit testing for the main parts
5. Rate limiter using `@nestjs/throttler`
6. Local git hooks for `linting` and `testing` using `yorkie` and `lint-staged`
7. Git actions workflow for PR reviews (`linting` and `testing`)
8. Some `SOLID` principles
9. Some patterns like `repository` and `Event Emitter`
10. Logging all requests and responses




## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Docs

- Import url-shortening-service.postman_collection into postman (found in the root dir)
- Navigate to `https://shortening.local.com/docs`

| Endpoint  | Usage  | Gateway Example  |
|--- |--- |--- |
| `GET` /  | Health check  | <https://shortening.local.com>  |
| `POST` /api/v1/urls/encode  | given `{"urlName: "www.google.com"}` then it will generate a short id for it to be used later and redirected to the long `urlName` and save it in the db  | <https://shortening.local.com/encode>  |
| `GET` /api/v1/urls/decode  | given the url short `id` it will redirected to the long url `name` and will cache it in addtion to save vist country, visit count and inc total clicks  | <https://shortening.local.com/559WLYubxkoB7PmkvJeHUi>  |
| `GET` /api/v1/urls/statistics  | given a short id then it will return some url statistics like `totalClicks` and `visits`  | <https://shortening.local.com/statistics/559WLYubxkoB7PmkvJeHUi>  |

## Stay in touch

- Author - [Abdelrahman Abdelhamed](https://www.linkedin.com/in/abdelrahman-abdelhamed/)

## License

[MIT licensed](LICENSE).
