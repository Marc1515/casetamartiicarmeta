import { ResolveAuthUserRoleUseCase } from "@/modules/auth/application/use-cases/ResolveAuthUserRoleUseCase";
import { PrismaAuthUserRepository } from "@/modules/auth/adapters/output/persistence/PrismaAuthUserRepository";

export function makeResolveAuthUserRoleUseCase(): ResolveAuthUserRoleUseCase {
    return new ResolveAuthUserRoleUseCase(new PrismaAuthUserRepository());
}