import { applyDecorators, Type } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";
import { UserDto } from "src/modules/user/dtos/user.dto";
import { PageDto } from "../dtos/page.dto";

export const ApiPaginatedResponse = <TModel extends Type<any>>(
    model: TModel,
) => {
    return applyDecorators(
        ApiExtraModels(PageDto, UserDto),
        ApiOkResponse({
            description: 'Successfully received model list',
            schema: {
                allOf: [
                    {$ref: getSchemaPath(PageDto)},
                    {
                        properties: {
                            data: {
                                type: 'array',
                                items: {$ref: getSchemaPath(model)},
                            },
                        },
                    },
                ],
            },
        }),
    );
};