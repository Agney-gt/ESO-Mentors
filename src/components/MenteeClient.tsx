"use client";

import { useState } from "react";
import { menteeSchema } from "@/lib/schema";
import MenteeProfileModal from "@/components/mentee-popup";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { z } from "zod"
import { Button } from "@/components/ui/button";


type Mentees = z.infer<typeof menteeSchema>;
export default function MenteeTable({ mentees }: { mentees: z.infer<typeof menteeSchema>[] })
{
  const [searchQuery, setSearchQuery] = useState("");
  const [SelectMentor, ] = useState<[z.infer<typeof menteeSchema> | null, boolean]>([null,false]);
  // const filteredMentors = [mentors].filter((mentor : z.infer<typeof mentorSchema>) =>
  //   mentor.name.toLowerCase().includes(searchQuery.toLowerCase())
  // );
  console.log(SelectMentor[0])

  return (
    <>
      <div className="space-y-6 gap-6 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            className="pl-10"
            placeholder="Search mentors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      
      
      <div>
      <Table>
        <TableHeader>
          <TableRow>
          <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Background</TableHead>
      <TableHead>Industry</TableHead>
          <TableHead>Status</TableHead> 
        <TableHead className="text-right">Profile</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mentees.map((mentor) => (
            <TableRow key={mentor.user_id}>
              <TableCell>{mentor.name}</TableCell>
              <TableCell>{mentor.email}</TableCell>
              <TableCell>{mentor.background}</TableCell>
              <TableCell>{mentor.industry}</TableCell>

              

              <TableCell>
                {mentor.approved ? (
                  <span className="text-green-600">Approved</span>
                ) : (
                  <span className="text-yellow-600">Pending</span>
                )}
              </TableCell>
              <TableCell className="text-right">
              <MenteeProfileModal mentee={mentor as Mentees} trigger = {<Button className="w-1/2">Card</Button>} />
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table></div></div>
    

    </>
  );
}
