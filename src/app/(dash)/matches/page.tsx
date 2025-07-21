// app/dashboard/mentors/page.tsx

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
//import { z } from "zod";
// import InviteUsersModal from "@/components//invite-users";
//import MatchTable from "@/components/MenteeClient";
// import { Button } from "@/components/ui/button";
// import { UserPlus } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import MentorMatchesTable from "@/components/MatchesPage";
//import { matchSchema } from "@/lib/schema";
//import { z } from "zod"; 

export default async function MatchesPage() {
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
 
  // Step 1: Fetch matches, mentors, and mentees
const { data: matches, error: matchError } = await supabase
.from("ESO_matches")
.select("*")
.eq("status", "pending");

const { data: mentors, error: mentorError } = await supabase
.from("ESO_mentors")
.select("*");

const { data: mentees, error: menteeError } = await supabase
.from("ESO_mentees")
.select("*");

// Step 2: Handle any errors
if (matchError || mentorError || menteeError) {
console.error("Fetch error:", { matchError, mentorError, menteeError });
return;
}

// Step 3: Create lookup maps for fast access
const mentorMap = new Map(mentors.map(m => [m.user_id, m]));
const menteeMap = new Map(mentees.map(m => [m.user_id, m]));
console.log(mentorMap, menteeMap)
// Step 4: Enrich each match with mentor and mentee info
const enrichedMatches = matches.map(match => {
const mentor = mentorMap.get(match.mentor_id) || null;
const mentee = menteeMap.get(match.mentee_id) || null;

return {
  ...match,
  mentor, // full mentor object
  mentee, // full mentee object
};
});
console.log(enrichedMatches)


  return (
    <div className="px-6 py-8">
      <div className="flex justify-between items-center mb-6">
       
        

      {<MentorMatchesTable enrichedMatches = {enrichedMatches} /> }
    </div></div>
  );
}
