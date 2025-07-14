import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { matchSchema, mentorSchema, menteeSchema } from "@/lib/schema";
import { z } from "zod";

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


  // Fetch pending matches
  const { data: matches, error: matchError } = await supabase
    .from("ESO_matches")
    .select("*")
    .eq("status", "pending");

  if (matchError) {
    return <div className="p-6 text-center text-red-500">Error loading matches</div>;
  }

  if (!matches || matches.length === 0) {
    return (
      <Card className="p-6 text-center">
        <CardTitle>No pending matches</CardTitle>
        <p className="text-sm text-gray-500">All matches have been reviewed.</p>
      </Card>
    );
  }

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
        {await Promise.all(
          matches.map(async (match: z.infer<typeof matchSchema>) => {
            const [menteeRes, mentorRes] = await Promise.all([
              supabase.from("Mentees").select("*").eq("id", match.menteeId).single(),
              supabase.from("Mentors").select("*").eq("id", match.mentorId).single()
            ]);

            const mentee = menteeRes.data as z.infer<typeof menteeSchema>;
            const mentor = mentorRes.data as z.infer<typeof mentorSchema>;

            return (
              <div key={match.id} className="mb-6 border-b pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">
                      Mentee: <span className="text-primary">{mentee?.name}</span>
                    </h3>
                    <p className="text-xs text-gray-500">
                      Application submitted:{" "}
                      {mentee?.createdAt ? new Date(mentee.createdAt).toLocaleDateString() : "N/A"}
                    </p>
                    <div className="mt-3">
                      <h4 className="text-sm font-semibold text-gray-600">AI-Suggested Mentor:</h4>
                      <div className="flex items-center gap-3 mt-2">
                        <Avatar>
                          <AvatarImage src="" alt={mentor?.name} />
                          <AvatarFallback>{getInitials(mentor?.name || "")}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{mentor?.name}</div>
                          <div className="text-xs text-gray-500">
                            {mentor?.title}, {mentor?.organization}
                          </div>
                        </div>
                        <Badge className="ml-auto bg-indigo-100 text-indigo-600">
                          {match.matchScore}% match
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <form action={`/api/matches/${match.id}/approve`} method="POST">
                    <Button type="submit" className="mt-2">Approve</Button>
                  </form>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
