import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import CreateMatchPage from '@/components/create_matches';
import {createClient} from '@supabase/supabase-js';
import {redirect } from 'next/navigation';

export default async function Page() {
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
   
  
  const { data: mentors, error: mentorError } = await supabase
  .from("ESO_mentors")
  .select("*");
  
  const { data: mentees, error: menteeError } = await supabase
  .from("ESO_mentees")
  .select("*");

  if (mentorError || menteeError) {
    console.error("Fetch error:", { mentorError, menteeError });
    return;
    }


  return (
    <CreateMatchPage
      mentors={mentors}
      mentees={mentees}
      organizationId={101}
    />
  );
}
