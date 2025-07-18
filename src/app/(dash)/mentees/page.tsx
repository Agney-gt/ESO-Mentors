// app/dashboard/mentors/page.tsx

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
// import InviteUsersModal from "@/components//invite-users";
import MenteeTable from "@/components/MenteeClient";
// import { Button } from "@/components/ui/button";
// import { UserPlus } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { menteeSchema } from "@/lib/schema";
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
  type Mentees = z.infer<typeof menteeSchema>;
  const { data: mentees } = await supabase
  .from("ESO_mentees")
  .select("*") as { data: Mentees[]; };

  

  return (
    <div className="px-6 py-8">
      <div className="flex justify-between items-center mb-6">
       
        

      <MenteeTable mentees ={mentees}/> 
    </div></div>
  );
}
