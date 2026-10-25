import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ProfileForm } from "./profile-form";
import { isDemoUser } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Customer Profile",
};

const Profile = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  const demoUser = isDemoUser(session.user.id);

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h2 className="h2-bold">Profile</h2>
      <ProfileForm
        user={{ name: session.user.name, email: session.user.email }}
        isDemoUser={demoUser}
      />
    </div>
  );
};

export default Profile;
