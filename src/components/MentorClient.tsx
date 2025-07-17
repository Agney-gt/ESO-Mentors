"use client";

import { useState } from "react";
import { mentorSchema } from "@/lib/schema";
import MentorProfileModal from "@/components/mentor-popup";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { z } from "zod"
import { Button } from "@/components/ui/button";


type Mentor = z.infer<typeof mentorSchema>;
export default function MentorTable({ mentors }: { mentors: z.infer<typeof mentorSchema>[] })
{
  const [searchQuery, setSearchQuery] = useState("");
  const [SelectMentor,  ] = useState<[z.infer<typeof mentorSchema> | null, boolean]>([null,false]);
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
      <TableHead>Organization</TableHead>
      <TableHead>Industry</TableHead>
          <TableHead>Status</TableHead> 
        <TableHead className="text-right">Profile</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mentors.map((mentor) => (
            <TableRow key={mentor.user_id}>
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
              <MentorProfileModal mentor={mentor as Mentor} trigger = {<Button className="w-1/2">Card</Button>} />
             
              
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table></div></div>
    

    </>
  );
}
