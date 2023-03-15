"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiFileAvatar = exports.ApiFile = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
function fileMimetypeFilter(...mimetypes) {
    return (req, file, callback) => {
        if (mimetypes.some((m) => file.mimetype.includes(m))) {
            callback(null, true);
        }
        else {
            callback(new common_1.UnsupportedMediaTypeException(`File type is not matching: ${mimetypes.join(', ')}`), false);
        }
    };
}
function ApiFile(fieldName = 'file', required = false, localOptions) {
    return (0, common_1.applyDecorators)((0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)(fieldName, localOptions)), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: required ? [fieldName] : [],
            properties: {
                [fieldName]: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }));
}
exports.ApiFile = ApiFile;
function ApiFileAvatar() {
    return ApiFile('avatar', true, {
        fileFilter: fileMimetypeFilter('image'),
        dest: './avatar_files',
    });
}
exports.ApiFileAvatar = ApiFileAvatar;
//# sourceMappingURL=api-avatar.decorator.js.map