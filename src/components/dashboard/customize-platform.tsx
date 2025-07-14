"use client"; // if in App Router and this is a client component

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CustomizePlatform() {
  return (
    <Card className="bg-white shadow rounded-lg overflow-hidden">
      <CardContent className="p-5 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-800">Platform Customization</h3>
        <p className="text-sm text-gray-500">
          Customize your mentor matching platform&apos;s appearance and functionality
        </p>
      </CardContent>

      <CardContent className="p-5">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Form Builder */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex flex-col h-full">
            <div className="flex items-center mb-4">
              <div className="bg-primary bg-opacity-10 p-2 rounded-md">
                <i className="fas fa-wpforms text-primary text-xl"></i>
              </div>
              <div className="ml-3">
                <h4 className="text-lg font-medium text-gray-800">Form Builder</h4>
                <p className="text-sm text-gray-500">Create custom onboarding forms</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Create personalized onboarding experiences for mentors and mentees with our no-code form builder. Add custom fields, question types, and required fields.
            </p>
            <div className="mt-auto">
            
                <Button asChild className="inline-flex items-center">
                <Link href="/form-builder" passHref>Open Form Builder</Link>
                </Button>
              
            </div>
          </div>

          {/* Branding */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex flex-col h-full">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-2 rounded-md">
                <i className="fas fa-paint-brush text-purple-600 text-xl"></i>
              </div>
              <div className="ml-3">
                <h4 className="text-lg font-medium text-gray-800">Branding</h4>
                <p className="text-sm text-gray-500">Customize platform appearance</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Update your organization&apos;s logo, colors, and other branding elements to create a seamless experience for your mentors and mentees.
            </p>
            <div className="mt-auto">
            
                <Button asChild variant="secondary">
                <Link href="/branding" passHref>Customize Branding</Link>
                </Button>
              
            </div>
          </div>

          {/* Email Templates */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex flex-col h-full">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-2 rounded-md">
                <i className="fas fa-envelope text-blue-600 text-xl"></i>
              </div>
              <div className="ml-3">
                <h4 className="text-lg font-medium text-gray-800">Email Templates</h4>
                <p className="text-sm text-gray-500">Customize automated emails</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Customize the email templates used for introductions, follow-ups, and feedback requests to match your organization&apos;s voice and branding.
            </p>
            <div className="mt-auto">
             
                <Button asChild style={{ backgroundColor: "#3b82f6" }}>
                <Link href="/communications" passHref>Edit Email Templates </Link>
                </Button>
             
            </div>
          </div>

          {/* AI Settings */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex flex-col h-full">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-2 rounded-md">
                <i className="fas fa-robot text-green-600 text-xl"></i>
              </div>
              <div className="ml-3">
                <h4 className="text-lg font-medium text-gray-800">AI Settings</h4>
                <p className="text-sm text-gray-500">Configure matching algorithm</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Adjust the AI matching algorithm to prioritize different factors when suggesting mentor-mentee matches, such as skills, availability, or industry experience.
            </p>
            <div className="mt-auto">
             
                <Button asChild style={{ backgroundColor: "#10b981" }}>
                <Link href="/settings" passHref>Configure AI Settings</Link>
                </Button>
              
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
