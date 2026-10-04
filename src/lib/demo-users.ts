/** Explicit local development fixtures; never accepted at their default passwords in production. */
export const DEMO_USERS = [
  { email: "master@merveilleux.test", name: "Demo Owner", password: "master1234", role: "master_admin" as const },
  { email: "admin@merveilleux.test", name: "Demo Admin", password: "admin1234", role: "admin" as const },
  { email: "distributor@merveilleux.test", name: "Demo Distributor", password: "dist1234", role: "distributor" as const },
  { email: "customer@merveilleux.test", name: "Demo Customer", password: "cust1234", role: "customer" as const },
] as const;

export function isLegacyDemoCredential(email: string, password: string): boolean {
  return DEMO_USERS.some((user) => user.email === email.trim().toLowerCase() && user.password === password);
}
