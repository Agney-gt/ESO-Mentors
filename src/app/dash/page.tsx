import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Adjust this path if needed
import { redirect } from "next/navigation";
import SignOutButton from "@/components/signOut";


import KeyMetrics from "@/components/dashboard/key-metrics";
import ActivityChart from "@/components/dashboard/activity-chart";
import RecentActivity from "@/components/dashboard/recent-activity";
import PendingMatches from "@/components/dashboard/pending-matches";
import CustomizePlatform from "@/components/dashboard/customize-platform";
//import InviteUsersModal from "@/components/modals/invite-users-modal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserPlus, ChevronDown, PlusCircle } from "lucide-react";

export default async function MindmapPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/"); // Redirect to login
  }

  return (
    <>
 
        <title>Dashboard | Mentor Match Platform</title>
        <meta name="description" content="Mentor matching platform dashboard showing key metrics and pending matches" />


      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Overview of your mentor-mentee matching program</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Button className="inline-flex items-center">
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Users
          </Button>
          <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline" className="inline-flex items-center">
      <span>Quick Action</span>
      <ChevronDown className="ml-2 h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>

  <DropdownMenuContent align="end">
    <DropdownMenuItem asChild>
      <a href="/matches/create" className="flex items-center">
        <PlusCircle className="mr-2 h-4 w-4" />
        <span>Create New Match</span>
      </a>
    </DropdownMenuItem>

    <DropdownMenuItem asChild>
      <div className="w-full">
        <SignOutButton />
      </div>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

        </div>
      </div>

      {/* Key Metrics */}
      <KeyMetrics />

      {/* Tabs */}
      <div className="mb-8 mt-8">
        <Tabs defaultValue="pending-matches">
          <TabsList>
            <TabsTrigger value="pending-matches" className="flex items-center">
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              Pending Matches
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center">
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              Activity
            </TabsTrigger>
            <TabsTrigger value="customize" className="flex items-center">
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33A1.65 1.65 0 0 0 14 21v.09A2 2 0 0 1 12 23a2 2 0 0 1-2-2V21a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15 1.65 1.65 0 0 0 3 14H2a2 2 0 0 1 0-4h1a1.65 1.65 0 0 0 1.6-1A1.65 1.65 0 0 0 4.6 7l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.6 1.65 1.65 0 0 0 10 3h.09A2 2 0 0 1 12 1a2 2 0 0 1 2 2v1a1.65 1.65 0 0 0 1 1.51A1.65 1.65 0 0 0 16.4 4.6l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-1a1.65 1.65 0 0 0-1.6 1z"></path></svg>
              Customize Platform
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending-matches" className="mt-4">
            <PendingMatches />
          </TabsContent>

          <TabsContent value="activity" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <ActivityChart />
              <RecentActivity />
            </div>
          </TabsContent>

          <TabsContent value="customize" className="mt-4">
            <CustomizePlatform />
          </TabsContent>
        </Tabs>
      </div>

      {/* Invite Modal - hook this up if you convert to server components */}
      {/* <InviteUsersModal isOpen={false} onClose={() => {}} /> */}
    </>
  );

}
