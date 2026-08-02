import { supabase } from "@/lib/supabase";

export const ADMIN_EMAIL = "tariqueblessed@gmail.com";

/**
 * Checks if the currently logged-in user is the admin.
 */
export async function isAdmin(): Promise<boolean> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user || !user.email) {
    return false;
  }

  return user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

/**
 * Redirects non-admin users away from admin pages.
 */
export async function requireAdmin() {
  const allowed = await isAdmin();

  if (!allowed) {
    alert("⛔ Access Denied. Administrator only.");
    window.location.href = "/dashboard";
    return false;
  }

  return true;
}