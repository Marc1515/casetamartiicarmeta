import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Account, Profile, Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { authCallbacks } from "@/modules/auth/adapters/output/next-auth/auth.callbacks";

const { isAdminEmailMock, executeMock, makeResolveAuthUserRoleUseCaseMock } =
    vi.hoisted(() => {
        return {
            isAdminEmailMock: vi.fn(),
            executeMock: vi.fn(),
            makeResolveAuthUserRoleUseCaseMock: vi.fn(),
        };
    });

vi.mock("@/modules/auth/application/services/admin-emails.service", () => {
    return {
        isAdminEmail: isAdminEmailMock,
    };
});

vi.mock("@/modules/auth/infrastructure/auth.dependencies", () => {
    return {
        makeResolveAuthUserRoleUseCase: makeResolveAuthUserRoleUseCaseMock,
    };
});

const callbacks = authCallbacks!;

type SignInParams = Parameters<NonNullable<typeof callbacks.signIn>>[0];
type JwtParams = Parameters<NonNullable<typeof callbacks.jwt>>[0];
type SessionParams = Parameters<NonNullable<typeof callbacks.session>>[0];

function buildSignInParams(overrides?: Partial<SignInParams>): SignInParams {
    const baseUser: User = {
        id: "user-1",
        email: "user@test.com",
        name: "User",
        image: null,
    };

    return {
        user: {
            ...baseUser,
            ...(overrides?.user ?? {}),
        },
        account: overrides?.account ?? (null as Account | null),
        profile: overrides?.profile ?? (undefined as Profile | undefined),
        email: overrides?.email,
        credentials: overrides?.credentials,
    };
}

describe("authCallbacks", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        makeResolveAuthUserRoleUseCaseMock.mockReturnValue({
            execute: executeMock,
        });
    });

    describe("signIn", () => {
        it("returns true when email is admin", async () => {
            isAdminEmailMock.mockReturnValue(true);

            const result = await callbacks.signIn!(
                buildSignInParams({
                    user: {
                        id: "user-1",
                        email: "admin@test.com",
                    },
                }),
            );

            expect(isAdminEmailMock).toHaveBeenCalledWith("admin@test.com");
            expect(result).toBe(true);
        });

        it("returns false when email is not admin", async () => {
            isAdminEmailMock.mockReturnValue(false);

            const result = await callbacks.signIn!(
                buildSignInParams({
                    user: {
                        id: "user-2",
                        email: "viewer@test.com",
                    },
                }),
            );

            expect(isAdminEmailMock).toHaveBeenCalledWith("viewer@test.com");
            expect(result).toBe(false);
        });
    });

    describe("jwt", () => {
        it("uses user email and user id when they are present", async () => {
            executeMock.mockResolvedValue({
                userId: "resolved-user-1",
                role: "ADMIN",
            });

            const params: JwtParams = {
                token: {
                    sub: "token-user",
                    email: "token@test.com",
                } as JWT,
                user: {
                    id: "user-1",
                    email: "Admin@Test.com",
                    name: "User",
                    image: null,
                } as User,
                account: null,
                profile: undefined,
                trigger: "signIn",
                isNewUser: false,
                session: undefined,
            };

            const result = await callbacks.jwt!(params);

            expect(executeMock).toHaveBeenCalledWith({
                email: "admin@test.com",
                userId: "user-1",
            });

            expect(result).toEqual({
                sub: "resolved-user-1",
                email: "token@test.com",
                role: "ADMIN",
            });
        });

        it("falls back to token email and token sub when user is not present", async () => {
            executeMock.mockResolvedValue({
                userId: "db-user-2",
                role: "VIEWER",
            });

            const params = {
                token: {
                    sub: "token-user-2",
                    email: "Viewer@Test.com",
                } as JWT,
                user: undefined,
                account: null,
                profile: undefined,
                trigger: "update",
                isNewUser: false,
                session: undefined,
            } as unknown as JwtParams;

            const result = await callbacks.jwt!(params);

            expect(executeMock).toHaveBeenCalledWith({
                email: "viewer@test.com",
                userId: "token-user-2",
            });

            expect(result).toEqual({
                sub: "db-user-2",
                email: "Viewer@Test.com",
                role: "VIEWER",
            });
        });

        it("keeps existing token sub when use case returns no userId", async () => {
            executeMock.mockResolvedValue({
                userId: undefined,
                role: "VIEWER",
            });

            const params = {
                token: {
                    sub: "token-user-3",
                    email: "viewer3@test.com",
                } as JWT,
                user: undefined,
                account: null,
                profile: undefined,
                trigger: "update",
                isNewUser: false,
                session: undefined,
            } as unknown as JwtParams;

            const result = await callbacks.jwt!(params);

            expect(result).toEqual({
                sub: "token-user-3",
                email: "viewer3@test.com",
                role: "VIEWER",
            });
        });
    });

    describe("session", () => {
        it("maps token sub and role into session user", async () => {
            const params: SessionParams = {
                session: {
                    user: {
                        id: "old-id",
                        role: "VIEWER",
                        email: "user@test.com",
                        name: "User",
                        image: null,
                    },
                    expires: "2026-12-31T23:59:59.999Z",
                } as Session,
                token: {
                    sub: "token-user-1",
                    role: "ADMIN",
                } as JWT,
                user: {
                    id: "old-id",
                    email: "user@test.com",
                    emailVerified: null,
                    name: "User",
                    image: null,
                    role: "VIEWER",
                } as SessionParams["user"],
                newSession: undefined,
                trigger: "update",
            };

            const result = await callbacks.session!(params);

            expect(result).toEqual({
                user: {
                    id: "token-user-1",
                    role: "ADMIN",
                    email: "user@test.com",
                    name: "User",
                    image: null,
                },
                expires: "2026-12-31T23:59:59.999Z",
            });
        });

        it("uses VIEWER as default role when token role is missing", async () => {
            const params: SessionParams = {
                session: {
                    user: {
                        id: "existing-id",
                        role: "VIEWER",
                        email: "user@test.com",
                        name: "User",
                        image: null,
                    },
                    expires: "2026-12-31T23:59:59.999Z",
                } as Session,
                token: {
                    sub: "existing-id",
                } as JWT,
                user: {
                    id: "existing-id",
                    email: "user@test.com",
                    emailVerified: null,
                    name: "User",
                    image: null,
                    role: "VIEWER",
                } as SessionParams["user"],
                newSession: undefined,
                trigger: "update",
            };

            const result = await callbacks.session!(params);

            expect(result).toEqual({
                user: {
                    id: "existing-id",
                    role: "VIEWER",
                    email: "user@test.com",
                    name: "User",
                    image: null,
                },
                expires: "2026-12-31T23:59:59.999Z",
            });
        });
    });
});