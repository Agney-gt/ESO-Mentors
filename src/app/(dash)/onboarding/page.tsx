// app/(dash)/onboarding/page.tsx
'use client';

import { SessionProvider } from "next-auth/react";
import Onboarding from "./component";

export default function OnboardingPage() {
  return (
    <SessionProvider>
   
      <Onboarding
  user={{
    email: "dummy@example.com",
    organizationId: "org_123456789",
  }}
/>
    </SessionProvider>
  );
}
