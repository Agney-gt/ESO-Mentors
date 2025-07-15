"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FormTemplatesList } from "./formTemplatesList";
import { formTemplateSchema } from "@/lib/schema";
import {z } from "zod" 

type FormTemplate = z.infer<typeof formTemplateSchema>;
interface Props {
  mentorTemplates: FormTemplate[];
  menteeTemplates: FormTemplate[];
}

export default function FormTabsCard({ mentorTemplates, menteeTemplates }: Props) {

  const [tab, setTab] = useState("mentor");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Templates</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={tab} onValueChange={setTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="mentor">Mentor Forms</TabsTrigger>
            <TabsTrigger value="mentee">Mentee Forms</TabsTrigger>
          </TabsList>

          <TabsContent value="mentor">
            <FormTemplatesList formType="mentor" templates={mentorTemplates} />
          </TabsContent>

          <TabsContent value="mentee">
            <FormTemplatesList formType="mentee" templates={menteeTemplates} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
