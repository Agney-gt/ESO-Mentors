"use client";

import { useState } from "react";
import { mentorSchema, formTemplateSchema } from "@/lib/schema";
import MentorDetailDialog from "@/components/invite-users";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { z } from "zod"
type Props = {
  mentors: z.infer<typeof mentorSchema[]>;
  formTemplateSchema?: z.infer<typeof formTemplateSchema>;
};

export default function MentorTable({ mentors, formTemplateSchema }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMentor, setSelectedMentor] = useState<z.infer<typeof mentorSchema> | null>(null);

  const filteredMentors = mentors.filter((mentor) =>
    mentor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            className="pl-10"
            placeholder="Search mentors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Organization</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMentors.map((mentor) => (
            <TableRow key={mentor.id}>
              <TableCell>{mentor.name}</TableCell>
              <TableCell>{mentor.email}</TableCell>
              <TableCell>{mentor.organization}</TableCell>
              <TableCell>{mentor.industry}</TableCell>
              <TableCell>
                {mentor.approved ? (
                  <span className="text-green-600">Approved</span>
                ) : (
                  <span className="text-yellow-600">Pending</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => setSelectedMentor(mentor)}
                >
                  View
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <MentorDetailDialog mentor={selectedMentor} onClose={() => setSelectedMentor(null)} />
    </>
  );
}
