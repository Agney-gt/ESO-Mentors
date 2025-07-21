// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { redirect } from "next/navigation";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { LogOut, Settings, Shield, User } from "lucide-react";
// import { EditProfileDialog } from "@/components/admin/edit-profile-dialog";
// import { organizationSchema } from "@/lib/schema";
// import {z} from "zod"
// export default async function AdminPage() {
//   const session = await getServerSession(authOptions);

//   if (!session?.user) {
//     redirect("/login");
//   }


 

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

//   return (
//     <div className="space-y-6">
//       <h1 className="text-3xl font-bold">Admin Profile</h1>
//       <p className="text-gray-500">Manage your profile and account settings</p>

//       <div className="grid gap-6 md:grid-cols-2">
//         {/* Profile Card */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <User className="h-5 w-5" />
//               Profile Information
//             </CardTitle>
//             <CardDescription>Your personal information and profile details</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center space-x-4 mb-6">
//               <Avatar className="h-16 w-16">
//                 <AvatarImage src="" />
//                 <AvatarFallback className="text-xl bg-primary text-white">
//                   {session.user.email?.charAt(0)?.toUpperCase() || "A"}
//                 </AvatarFallback>
//               </Avatar>
//               <div>
//                 <h3 className="text-xl font-medium">{session.user.username || session.user.email || "Admin"}</h3>
//                 <p className="text-sm text-gray-500">{session.user.email || "No email provided"}</p>
//               </div>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <h4 className="text-sm font-medium text-gray-500">Username</h4>
//                 <p>{session.user.username || "admin"}</p>
//               </div>
//               <div>
//                 <h4 className="text-sm font-medium text-gray-500">Email</h4>
//                 <p>{session.user.email || "No email provided"}</p>
//               </div>
//               <div>
//                 <h4 className="text-sm font-medium text-gray-500">Role</h4>
//                 <p className="flex items-center gap-1">
//                   <Shield className="h-4 w-4 text-primary" />
//                   Administrator
//                 </p>
//               </div>
//               <div>
//                 <h4 className="text-sm font-medium text-gray-500">Organization</h4>
//                 <p>{organization?.name || "organization"}</p>
//               </div>
//             </div>
//           </CardContent>
//           <CardFooter className="flex justify-end border-t px-6 py-4">
//             <EditProfileDialog />
//           </CardFooter>
//         </Card>

//         {/* Settings Card */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Settings className="h-5 w-5" />
//               Account Settings
//             </CardTitle>
//             <CardDescription>Manage your account settings and session</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div>
//               <h4 className="text-sm font-medium text-gray-500">Account Status</h4>
//               <p className="flex items-center gap-2">
//                 <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
//                 Active
//               </p>
//             </div>
//             <div>
//               <h4 className="text-sm font-medium text-gray-500">Last Login</h4>
//               <p>{new Date().toLocaleString()}</p>
//             </div>
//           </CardContent>
//           <CardFooter className="flex justify-between items-center border-t px-6 py-4">
//             <div className="text-sm text-gray-500">Session will expire in 7 days</div>
//             <form action="/api/logout" method="post">
//               <Button variant="destructive" type="submit">
//                 <LogOut className="h-4 w-4 mr-2" />
//                 Log Out
//               </Button>
//             </form>
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   );
// }
