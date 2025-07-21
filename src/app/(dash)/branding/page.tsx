// app/(dash)/branding/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import BrandingClient from "@/components/BrandingClient";

export default async function BrandingPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const res = await fetch(`http://localhost:3000/api/organization`, {//${process.env.NEXT_PUBLIC_BASE_URL}
    cache: "no-store",
  });

  if (!res.ok) redirect("/error");

  const organization = await res.json();

  return <BrandingClient organization={organization} />;
}
