"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { formTemplateSchema } from "@/lib/schema";
import { FileText, UserPlus } from "lucide-react";
import { toast } from "sonner"
interface InviteUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultUserType?: "mentor" | "mentee";
  formTemplates: typeof formTemplateSchema[];
}
// Parse CSV of emails
function parseEmailList(text: string): string[] {
    if (!text) return [];
    
    return text
      .split(/[,;\n]/)
      .map(email => email.trim())
      .filter(email => email);
  }

export default function InviteUsersModal({
  isOpen,
  onClose,
  defaultUserType = "mentor",
  formTemplates,
}: InviteUsersModalProps) {
  const router = useRouter();


  const [userType, setUserType] = useState<"mentor" | "mentee">(defaultUserType);
  const [emailsText, setEmailsText] = useState("");
  const [invitationMessage, setInvitationMessage] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emails = parseEmailList(emailsText);

  const filteredTemplates = formTemplates.filter((t) => t.type === userType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emails.length === 0) {
      toast("Please enter at least one valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emails,
          userType,
          message: invitationMessage,
          formTemplateId: selectedTemplateId ? parseInt(selectedTemplateId) : null,
          organizationId: 1, // TODO: Replace with dynamic value
        }),
      });

      if (!res.ok) throw new Error("Failed to send invitations");

      toast(`Invitations sent to ${emails.length} ${userType}s!`);

      // Reset
      setEmailsText("");
      setInvitationMessage("");
      setSelectedTemplateId("");
      onClose();
      router.refresh(); // Optional, to refetch data
    } catch (error: any) {
      toast(`${error.message} || "Something went wrong"`)

    
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Invite Users
          </DialogTitle>
          <DialogDescription>
            Send invitations to prospective mentors and mentees.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>User Type</Label>
              <RadioGroup
                defaultValue={userType}
                onValueChange={(v) => setUserType(v as "mentor" | "mentee")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mentor" id="mentor" />
                  <Label htmlFor="mentor">Mentors</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mentee" id="mentee" />
                  <Label htmlFor="mentee">Mentees</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="form-template">Form Template</Label>
              <Select
                value={selectedTemplateId}
                onValueChange={setSelectedTemplateId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a form template" />
                </SelectTrigger>
                <SelectContent>
                  {filteredTemplates.length > 0 ? (
                    filteredTemplates.map((template) => (
                      <SelectItem key={template.id} value={String(template.id)}>
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-gray-500" />
                          {template.name}
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-gray-500">
                      No templates available
                    </div>
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Selected form will be sent during signup.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Email Addresses</Label>
              <Textarea
                placeholder="Enter emails, separated by commas"
                rows={4}
                value={emailsText}
                onChange={(e) => setEmailsText(e.target.value)}
              />
              {emails.length > 0 && (
                <p className="text-sm text-gray-500">
                  {emails.length} valid email{emails.length > 1 ? "s" : ""}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Invitation Message (optional)</Label>
              <Textarea
                rows={3}
                placeholder="Add a personal message"
                value={invitationMessage}
                onChange={(e) => setInvitationMessage(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="sm:justify-between">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Invitations"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
