// src/modules/auth/application/services/admin-emails.service.ts
export const getAdminEmails = (): string[] => {
    return (process.env.ADMIN_EMAILS || "")
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean);
};

export const isAdminEmail = (email?: string | null): boolean => {
    if (!email) return false;

    const normalizedEmail = email.toLowerCase();
    return getAdminEmails().includes(normalizedEmail);
};