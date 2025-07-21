import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }


 

//   let organization: z.infer<typeof organizationSchema> | null = null;

//   if (session.user.organizationId) {
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/organizations?id=${session.user.organizationId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         },
//         cache: "no-store"
//       });
//       if (res.ok) {
//         organization = await res.json();
//       }
//     } catch (err) {
//       console.error("Failed to fetch organization", err);
//     }
//   }

//   const handleLogoutClient = () => {
//     // This is client-side logic; for now, just include a placeholder
//   };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Profile</h1>
      <p className="text-gray-500">Manage your profile and account settings</p>

      
    </div>
  );
}
