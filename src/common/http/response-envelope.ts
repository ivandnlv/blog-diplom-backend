export class ResponseEnvelope<T> {
  // В Swagger generic сам по себе не раскроется,
  // но мы будем описывать data через @ApiOkResponse вручную.
  data: T | null;
  message: string | string[] | null;
  error: string | null;
  statusCode: number;
}
