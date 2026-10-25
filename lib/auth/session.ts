export async function getSessionUser() {
  const isServerLoggedIn = true; 
  const userRole = "admin";

  if (!isServerLoggedIn) {
    return null;
  }

  return {
    id: "usr_admin_01",
    name: "Admin GateLand",
    role: userRole,
  };
}

export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    throw new Error("UNAUTHORIZED: Anda tidak memiliki akses admin!");
  }
  return user;
}