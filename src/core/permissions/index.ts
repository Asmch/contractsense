// Placeholder types until real models are implemented
type BaseUser = { id: string; role: "admin" | "user" | "guest" };
type BaseContract = { id: string; ownerId: string; status: string };

export const permissions = {
  canUploadContract: (user: BaseUser | null): boolean => {
    if (!user) return false;
    return ["admin", "user"].includes(user.role);
  },

  canAccessContract: (user: BaseUser | null, contract: BaseContract): boolean => {
    if (!user) return false;
    if (user.role === "admin") return true;
    return contract.ownerId === user.id;
  },

  canGenerateReport: (user: BaseUser | null, contract: BaseContract): boolean => {
    return permissions.canAccessContract(user, contract);
  },

  canViewAnalytics: (user: BaseUser | null): boolean => {
    return user?.role === "admin";
  }
};
