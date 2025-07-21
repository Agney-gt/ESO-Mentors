'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { getInitials } from '@/lib/utils';
import { menteeSchema, mentorSchema } from '@/lib/schema';

import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

const createMatchSchema = z.object({
  mentorId: z.string().min(1, "Mentor is required"),
  menteeId: z.string().min(1, "Mentee is required"),
});

type CreateMatchForm = z.infer<typeof createMatchSchema>;

export default function CreateMatchPage({
  mentors,
  mentees,
  organizationId,
}: {
  mentors: z.infer<typeof mentorSchema>[];
  mentees: z.infer<typeof menteeSchema>[];
  organizationId: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preSelectedMenteeId = searchParams.get('menteeId') ?? '';

  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);
  const [selectedMenteeId, setSelectedMenteeId] = useState<string | null>(preSelectedMenteeId);

  const approvedMentors = mentors.filter((m) => m.approved);
  const approvedMentees = mentees.filter((m) => m.approved);

  const form = useForm<CreateMatchForm>({
    resolver: zodResolver(createMatchSchema),
    defaultValues: {
      mentorId: '',
      menteeId: preSelectedMenteeId,
    },
  });

  const selectedMentor = approvedMentors.find((m) => m.user_id!.toString() === selectedMentorId);
  const selectedMentee = approvedMentees.find((m) => m.user_id!.toString() === selectedMenteeId);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'mentorId') setSelectedMentorId(value.mentorId!);
      if (name === 'menteeId') setSelectedMenteeId(value.menteeId!);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  async function onSubmit(data: CreateMatchForm) {
    try {
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mentor_id: parseInt(data.mentorId),
          mentee_id: parseInt(data.menteeId),
          status: 'pending',
          organizationId,
        }),
      });

      if (!res.ok) throw new Error('Failed to create match');
      router.push('/matches');
    } catch (error) {
      alert('Error creating match');
      console.error(error);
    }
  }

  if (!mentors || !mentees) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between mt-20 mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Create Match</h1>
          <p className="text-sm text-gray-500">Manually create a new mentor-mentee match</p>
        </div>
        <Button variant="outline" onClick={() => router.push('/matches')}>Back to Matches</Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mentor Selection */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="mentorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Mentor</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a mentor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {approvedMentors.map((mentor) => (
                          <SelectItem key={mentor.user_id} value={mentor.user_id!.toString()}>
                            {mentor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedMentor && (
                <Card>
                  <CardHeader><CardTitle>Mentor Details</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex gap-4 mb-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src="" alt={selectedMentor.name} />
                        <AvatarFallback>{getInitials(selectedMentor.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3>{selectedMentor.name}</h3>
                        <p className="text-sm text-gray-500">
                          {selectedMentor.formResponses?.title ?? selectedMentor.title}, {selectedMentor.formResponses?.organization ?? selectedMentor.organization}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Mentee Selection */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="menteeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Mentee</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a mentee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {approvedMentees.map((mentee) => (
                          <SelectItem key={mentee.user_id} value={mentee.user_id!.toString()}>
                            {mentee.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedMentee && (
                <Card>
                  <CardHeader><CardTitle>Mentee Details</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex gap-4 mb-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src="" alt={selectedMentee.name} />
                        <AvatarFallback>{getInitials(selectedMentee.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3>{selectedMentee.name}</h3>
                        <p className="text-sm text-gray-500">Mentee</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={!selectedMentor || !selectedMentee}>
              Create Match
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
