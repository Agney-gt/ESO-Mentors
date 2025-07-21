"use client"
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Building2, MapPin, FileText, ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";

const onboardingSchema = z.object({
  organizationName: z.string().min(1, "Organization name is required"),
  location: z.string().min(1, "Location is required"),
  about: z.string().min(10, "Please provide at least 10 characters describing your organization"),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

export default function Onboarding({ user }: { user: { email: string; organizationId: string } }) {
  
  const { data: session, status } = useSession();
  console.log(session,status,user)
  
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      organizationName: "",
      location: "",
      about: "",
    },
  });
  if (status === 'loading') return <div>Loading...</div>;
  if (!session || !session.user) return <div className='mt-12'>Not authenticated</div>; 
  const onSubmit = async (data: OnboardingFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/onboarding`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organization_name: data.organizationName,
          location: data.location,
          about: data.about,
          email: session?.user!.email, // Use session email
        }),
        
      });

      if (!response.ok) {
        throw new Error("Failed to update organization");
      }

      toast("Your organization has been set up successfully.");

      router.push("/dash");
    } catch (error) {
        toast(`description: ${error instanceof Error ? error.message : 'Failed to set up organization'}`);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
   

        <title>Setup Your Organization | Mentor Match Platform</title>
        <meta name="description" content="Complete your organization setup" />
 

      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome to Mentor Match!</CardTitle>
            <CardDescription>
              Let&apos;s set up your organization to get started with your mentoring platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="organizationName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Organization Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your organization name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Location
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="City, State/Province, Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="about"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        About Your Organization
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your organization, its mission, and goals for the mentoring program..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
                      Setting up...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

