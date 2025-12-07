// src/common/http/swagger-helpers.ts
import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ResponseEnvelope } from './response-envelope';
import { PaginatedResultDto } from '../pagination/paginated-result.dto';

export function ApiOkResponseEnvelope<TModel extends Type<any>>(
  model: TModel,
  options?: { isPaginated?: boolean },
) {
  const isPaginated = options?.isPaginated ?? false;

  // dataType: либо модель, либо PaginatedResultDto<модель>
  const dataSchema = isPaginated
    ? {
        allOf: [
          { $ref: getSchemaPath(PaginatedResultDto) },
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      }
    : { $ref: getSchemaPath(model) };

  return applyDecorators(
    ApiExtraModels(ResponseEnvelope, PaginatedResultDto, model),
    ApiOkResponse({
      schema: {
        allOf: [
          {
            $ref: getSchemaPath(ResponseEnvelope),
          },
          {
            properties: {
              data: dataSchema,
              message: {
                oneOf: [
                  { type: 'string' },
                  { type: 'array', items: { type: 'string' } },
                ],
                nullable: true,
              },
              error: { type: 'string', nullable: true },
              statusCode: { type: 'number' },
            },
          },
        ],
      },
    }),
  );
}
