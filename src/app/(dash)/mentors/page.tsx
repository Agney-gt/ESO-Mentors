// app/dashboard/mentors/page.tsx

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import InviteUsersModal from "@/components//invite-users";
import MentorTable from "@/components/MentorClient";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export default async function MentorsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login");
  }

  const mentors = await db.mentor.findMany({}); // Replace with Supabase or your DB call
  const formTemplates = await db.formTemplate.findMany({ where: { type: "mentor" } });

  const mentorFormTemplate = formTemplates.find(t => t.type === "mentor");

  return (
    <div className="px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Mentors</h1>
          <p className="text-sm text-muted-foreground">Manage your mentors and their profiles</p>
        </div>
        <InviteUsersModal defaultUserType="mentor">
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Mentors
          </Button>
        </InviteUsersModal>
      </div>

      <MentorTable mentors={mentors} formTemplate={mentorFormTemplate} />
    </div>
  );
}
