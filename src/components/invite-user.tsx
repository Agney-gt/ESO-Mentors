"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { formTemplateSchema, } from "@/lib/schema";
import { UserPlus, FileText } from "lucide-react";
import { z } from "zod";
interface InviteUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultUserType?: "mentor" | "mentee";
}

export default function InviteUsersModal({
  isOpen,
  onClose,
  defaultUserType = "mentor",
}: InviteUsersModalProps) {
  const [userType, setUserType] = useState<"mentor" | "mentee">(defaultUserType);
  const [emailsText, setEmailsText] = useState("");
  const [invitationMessage, setInvitationMessage] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [formTemplates, setFormTemplates] = useState<z.infer<typeof formTemplateSchema>[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // Parse CSV of emails
  function parseEmailList(text: string): string[] {
    if (!text) return [];
    
    return text
      .split(/[,;\n]/)
      .map(email => email.trim())
      
  }
  const emails = parseEmailList(emailsText);
 
  const router = useRouter();

  // Fetch form templates when modal opens or userType changes
  useEffect(() => {
    if (!isOpen) return;

    const fetchTemplates = async () => {
      setLoadingTemplates(true);
      try {
        const res = await fetch(`/api/form-templates?type=${userType}&organizationId=1`);
        if (!res.ok) throw new Error("Failed to fetch templates");
        const data = await res.json();
        setFormTemplates(data);
      } catch (err) {
        if (err instanceof Error) {
            toast(err.message || "An error occurred");
          } else {
            toast("An unexpected error occurred");
          }
      } finally {
        setLoadingTemplates(false);
      }
    };

    fetchTemplates();
    setSelectedTemplateId("");
  }, [userType, isOpen, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emails.length === 0) {
      toast("Please enter at least one valid email.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emails,
          userType,
          message: invitationMessage,
          organizationId: 1,
          formTemplateId: selectedTemplateId ? parseInt(selectedTemplateId) : null,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to send invitations");
      }

      toast(
        `Invited ${emails.length} ${userType}(s)`,
      );

      setEmailsText("");
      setInvitationMessage("");
      setSelectedTemplateId("");
      onClose();
      router.refresh(); // Refresh data if needed
    } catch (err: Error | unknown) {
        if (err instanceof Error) {
            toast(err.message || "An error occurred");
          } else {
            toast("An unexpected error occurred");
          }

  
    } finally {
      setSubmitting(false);
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
            Send invitations to prospective mentors or mentees.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* User Type */}
            <div className="space-y-2">
              <Label>User Type</Label>
              <RadioGroup
                defaultValue={userType}
                onValueChange={(val) => setUserType(val as "mentor" | "mentee")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mentor" id="mentor" />
                  <Label htmlFor="mentor">Mentor</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mentee" id="mentee" />
                  <Label htmlFor="mentee">Mentee</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Form Template */}
            <div className="space-y-2">
              <Label htmlFor="form-template">Form Template</Label>
              <Select
                value={selectedTemplateId}
                onValueChange={setSelectedTemplateId}
              >
                <SelectTrigger id="form-template">
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {loadingTemplates ? (
                    <div className="p-2 text-sm text-gray-500">Loading templates...</div>
                  ) : formTemplates.length > 0 ? (
                    formTemplates.map((template) => (
                      <SelectItem key={template.id} value={String(template.id)}>
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          {template.name}
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-gray-500">
                      No templates available for {userType}s
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Email Addresses */}
            <div className="space-y-2">
              <Label htmlFor="emails">Email Addresses</Label>
              <Textarea
                id="emails"
                rows={4}
                value={emailsText}
                onChange={(e) => setEmailsText(e.target.value)}
                placeholder="Separate emails with commas"
              />
              {emails.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {emails.length} valid email{emails.length > 1 ? "s" : ""} found
                </p>
              )}
            </div>

            {/* Optional Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Invitation Message (optional)</Label>
              <Textarea
                id="message"
                rows={3}
                value={invitationMessage}
                onChange={(e) => setInvitationMessage(e.target.value)}
                placeholder="Add a personal note"
              />
            </div>
          </div>

          <DialogFooter className="sm:justify-between">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || emails.length === 0}>
              {submitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span> Sending...
                </>
              ) : (
                "Send Invitations"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
