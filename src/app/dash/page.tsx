import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Adjust this path if needed
import { redirect } from "next/navigation";
import SignOutButton from "@/components/signOut";
export default async function MindmapPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/"); // Redirect to login
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">ESO Mentor/Mentee Platform Demo</h1>
      <p className="text-gray-700">✅ Logged in as: <strong>{session.user.email}</strong></p>
      <SignOutButton />
    </div>
  );
}
