import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ApproveButton } from "@/components/approveButton";
// import { getInitials } from "@/lib/utils";
// import { matchSchema, mentorSchema, menteeSchema } from "@/lib/schema";
//import { z } from "zod";
//import { formResponsesSchema } from "@/lib/schema";
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase environment variables");
}
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);  

export default async function PendingMatchesPage() {
  const session = await getServerSession(authOptions);

  const isUnauthenticated = !session?.user?.email;

  if (isUnauthenticated) {
    return <div>Unauthorized</div>;
  }
  
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
console.log("✅ Enriched Matches:", enrichedMatches);


  return (
    <Card className="bg-white shadow rounded-lg overflow-hidden">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="text-lg font-medium text-gray-800">
          Pending Match Approvals
        </CardTitle>
        <p className="text-sm text-gray-500">
          Review and approve AI-suggested mentor-mentee matches
        </p>
      </CardHeader>
      <CardContent>
      {enrichedMatches?.map((match) => {
  return (
    <div
      key={match.id}
      className="mb-6 border rounded-xl p-5 shadow-sm bg-white hover:shadow-md transition"
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            {/* Avatar with fallback initials */}
            <Avatar>
              <AvatarImage src="" alt={`Mentor ${match.mentor_id}`} />
              <AvatarFallback>👤</AvatarFallback>
            </Avatar>

            <div>
              <div className="text-sm font-semibold text-gray-700">
               Mentor Name: <span className="text-primary">{match.mentor.name}</span>
              </div>
              <div className="text-sm font-semibold text-gray-700">
               Mentee Name: <span className="text-primary">{match.mentee.name}</span>
              </div>
              <div className="text-xs text-gray-500">
                Created: {new Date(match.created_at).toLocaleString()}
              </div>
            </div>

            {/* Match Score Badge */}
            <Badge className="ml-auto bg-green-100 text-green-700">
              {match.match_score}% Match
            </Badge>
          </div>

          {/* Match Metadata */}
          <div className="text-xs text-gray-600 space-y-1">
            <div><strong>Mentor Industry</strong> {match.mentor.industry}</div>
            <div>
            <strong>Mentor Background:</strong>{" "}
            {match.mentor?.title ? match.mentor.title : match.mentee?.background}
          </div>
          <div>
            <strong>Mentee Background:</strong>{" "}
            {match.mentee?.background}
          </div>
            <div><strong>Status:</strong> {match.status}</div>
            <div><strong>Session Scheduled:</strong> {match.session_scheduled ? "Yes" : "No"}</div>
            <div><strong>Intro Email Sent:</strong> {match.intro_email_sent ? "Yes" : "No"}</div>
            <div><strong>Follow-up Email Sent:</strong> {match.follow_up_email_sent ? "Yes" : "No"}</div>
            <div><strong>Updated:</strong> {new Date(match.updated_at).toLocaleString()}</div>
          </div>

          {/* Match Reasons */}
          {match.match_reasons?.length > 0 && (
            <div className="mt-2">
              <div className="text-xs font-medium text-gray-500 mb-1">Match Reasons:</div>
              <div className="flex flex-wrap gap-2">
              {(match.match_reasons as string[]).map((reason, idx) => (
                    <Badge
                      key={idx}
                      className="bg-blue-100 text-blue-700 border border-blue-200"
                    >
                      {reason}
                    </Badge>
                  ))}
                                </div>
                              </div>
                            )}
                          </div>

        {/* Approve Button */}
        <ApproveButton match={match} />

      </div>
    </div>
  );
})}


      </CardContent>
    </Card>
  );
}
