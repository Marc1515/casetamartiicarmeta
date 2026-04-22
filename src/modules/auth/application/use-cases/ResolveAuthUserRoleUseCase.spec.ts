import { afterEach, describe, expect, it, vi } from "vitest";
import { ResolveAuthUserRoleUseCase } from "@/modules/auth/application/use-cases/ResolveAuthUserRoleUseCase";
import type { AuthUserRepository } from "@/modules/auth/application/ports/AuthUserRepository";

function createAuthUserRepositoryMock(): AuthUserRepository & {
    findByEmail: ReturnType<typeof vi.fn>;
    updateRole: ReturnType<typeof vi.fn>;
} {
    return {
        findByEmail: vi.fn(),
        updateRole: vi.fn(),
    };
}

describe("ResolveAuthUserRoleUseCase", () => {
    afterEach(() => {
        delete process.env.ADMIN_EMAILS;
    });

    it("returns viewer when email is missing", async () => {
        const repository = createAuthUserRepositoryMock();
        const useCase = new ResolveAuthUserRoleUseCase(repository);

        const result = await useCase.execute({});

        expect(result).toEqual({
            userId: undefined,
            role: "VIEWER",
        });
    });

    it("returns admin and updates role when email is admin", async () => {
        process.env.ADMIN_EMAILS = "meq.1515@gmail.com";

        const repository = createAuthUserRepositoryMock();
        const useCase = new ResolveAuthUserRoleUseCase(repository);

        const result = await useCase.execute({
            email: "meq.1515@gmail.com",
            userId: "user-1",
        });

        expect(repository.updateRole).toHaveBeenCalledWith("user-1", "ADMIN");
        expect(result).toEqual({
            userId: "user-1",
            role: "ADMIN",
        });
    });

    it("returns viewer when user is not found and email is not admin", async () => {
        process.env.ADMIN_EMAILS = "admin@test.com";

        const repository = createAuthUserRepositoryMock();
        repository.findByEmail.mockResolvedValue(null);

        const useCase = new ResolveAuthUserRoleUseCase(repository);

        const result = await useCase.execute({
            email: "viewer@test.com",
            userId: "user-2",
        });

        expect(repository.findByEmail).toHaveBeenCalledWith("viewer@test.com");
        expect(result).toEqual({
            userId: "user-2",
            role: "VIEWER",
        });
    });

    it("returns database user role when user exists", async () => {
        process.env.ADMIN_EMAILS = "admin@test.com";

        const repository = createAuthUserRepositoryMock();
        repository.findByEmail.mockResolvedValue({
            id: "db-user-1",
            email: "viewer@test.com",
            role: "VIEWER",
        });

        const useCase = new ResolveAuthUserRoleUseCase(repository);

        const result = await useCase.execute({
            email: "viewer@test.com",
            userId: "token-user-id",
        });

        expect(result).toEqual({
            userId: "db-user-1",
            role: "VIEWER",
        });
    });
});