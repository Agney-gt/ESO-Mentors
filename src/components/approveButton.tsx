
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ApproveButton({ match }: { match: any }) {//eslint-disable-line @typescript-eslint/no-explicit-any
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/matches/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ matchId: match.id }),
      });

      if (res.ok) {
        console.log("Match approved!");
        // Optionally trigger UI update here
      } else {
        console.error("Failed to approve match");
      }
    } catch (error) {
      console.error("Error approving match:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className="mt-2"
      onClick={handleApprove}
      disabled={isLoading}
      variant={isLoading ? "secondary" : "default"} // Optional: changes visual style
    >
      {isLoading ? "Approving..." : "Approve"}
    </Button>
  );
}

