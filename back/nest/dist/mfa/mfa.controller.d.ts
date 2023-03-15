import { MfaService } from './mfa.service';
import { MfaSetupDto } from './dto/mfa-setup.dto';
import { MfaValidateDto } from './dto/mfa-validate.dto';
export declare class MfaController {
    private mfaService;
    constructor(mfaService: MfaService);
    initSignIn(userId: string): Promise<void>;
    validateSignIn(userId: string, dto: MfaValidateDto): Promise<{
        access_token: string;
    }>;
    initSetup(userId: string, dto: MfaSetupDto): Promise<boolean>;
    finishSetup(userId: string, dto: MfaValidateDto): Promise<void>;
    disable(userId: string): Promise<import(".prisma/client").User>;
}
