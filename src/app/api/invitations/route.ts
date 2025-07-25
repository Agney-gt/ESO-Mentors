// app/api/invitations/route.ts

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);



export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
   

    const { emails, userType, message, organizationId, formTemplateId } = body
    console.log(emails, userType, message, organizationId, formTemplateId);
    const sender = "onboarding@resend.dev"; // Use a verified domain with Resend

    // Send an email to each invitee
    const results = await Promise.allSettled(
      emails.map((email : string) =>
        
        resend.emails.send({
          from: `${sender}`,
          to: email,
          subject: `You're invited to join as a ${userType}`,
          html: `
            <p>Hello,</p>
            <p>You have been invited to join Sure Path as a <strong>${userType}</strong>.</p>
            ${
              message
                ? `<p>Message from the inviter:</p><blockquote>${message}</blockquote>`
                : ""
            }
            <p>Click <a href="https://eso-mentors-agney-gts-projects.vercel.app/forms/${userType}/${formTemplateId}">here</a> to join.</p>
            <p>Organization ID: ${organizationId}</p>
          `,
        })
      )
    );
    console.log("Invite results:", results);
    const failures = results.filter(r => r.status === "rejected");
    if (failures.length > 0) {
      return NextResponse.json({ message: "Some invites failed", failures }, { status: 207 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ message: "invalid request", errors: err.issues }, { status: 400 });
    }

    console.error("Error sending invitations:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
