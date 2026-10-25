import { auth} from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export async function requireAdmin(){
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if(session?.user?.role !== "admin"){
    redirect('/unauthorized');
  }

  return session;
}

// For server actions: throw instead of redirecting so the action can return an error
export async function requireAdminAction() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  return session;
}