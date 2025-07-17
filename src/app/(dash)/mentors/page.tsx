// app/dashboard/mentors/page.tsx

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
// import InviteUsersModal from "@/components//invite-users";
import MentorTable from "@/components/MentorClient";
// import { Button } from "@/components/ui/button";
// import { UserPlus } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { mentorSchema } from "@/lib/schema";
import { z } from "zod"; 
export default async function MentorsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login");
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Missing Supabase environment variables");
  }
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );  
  type Mentor = z.infer<typeof mentorSchema>;
  const { data: mentors } = await supabase
  .from("ESO_mentors")
  .select("*") as { data: Mentor[]; };

  

  return (
    <div className="px-6 py-8">
      <div className="flex justify-between items-center mb-6">
       
        

      <MentorTable mentors ={mentors}/> 
    </div></div>
  );
}
