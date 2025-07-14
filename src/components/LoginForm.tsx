"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("password");
  const [isPending, setIsPending] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsPending(true);
    try {
      const res = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false, // Set to true if you want auto-navigation
      });
  
      if (res?.ok) {
        router.push("/dash"); // or your desired page
      } else {
        alert("Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setIsPending(false);
    }
  };

  const handleOAuthLogin = async () => {
    try {
      await signIn("google", { callbackUrl: "/dash" });
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Mentor Match Platform</CardTitle>
        <CardDescription>Log in to manage your mentor matching program</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="password" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="password">Account</TabsTrigger>
            <TabsTrigger value="oauth">oAuth</TabsTrigger>
          </TabsList>

          <TabsContent value="password" className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter your password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Log in"
                  )}
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="oauth" className="space-y-4">
            <p className="text-sm text-center text-gray-500 mb-4">
              Log in securely using an external authentication provider.
            </p>
            <Button onClick={handleOAuthLogin} className="w-full">
              Login with OAuth
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4">
        <Separator />
        <div className="text-center text-sm text-gray-500">
          <p>
            Don&apos;t have an account? <Link href="/register" className="text-blue-600 hover:underline">Register</Link>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
