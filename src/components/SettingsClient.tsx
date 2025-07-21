"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Save, UserCog, Brain, Mail, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {toast} from "sonner"

export default function Settings() {

  const [aiWeights, setAiWeights] = useState({
    expertise: 40,
    industry: 20,
    availability: 30,
    meetingFormat: 10,
  });
  const [matchThreshold, setMatchThreshold] = useState(70);
  const [adminApprovalRequired, setAdminApprovalRequired] = useState(true);
  const [autoSendFollowUp, setAutoSendFollowUp] = useState(true);
  const [autoSendFeedback, setAutoSendFeedback] = useState(true);
  const [followUpDelay, setFollowUpDelay] = useState("3");
  const [feedbackDelay, setFeedbackDelay] = useState("1");

  const saveSettings = async (type: "ai" | "comm" | "security") => {
    await new Promise((res) => setTimeout(res, 500));
    toast(

 `Your ${type} settings have been updated successfully.`

    );
  };

  const handleWeightChange = (category: keyof typeof aiWeights, value: number) => {
    const otherKeys: Array<keyof typeof aiWeights> = Object.keys(aiWeights).filter(k => k !== category) as Array<keyof typeof aiWeights>;
    const otherSum = otherKeys.reduce((sum, k) => sum + aiWeights[k], 0);
    const ratio = (100 - value) / otherSum;
    const newWeights = { ...aiWeights, [category]: value };
    otherKeys.forEach(k => newWeights[k] = Math.round(aiWeights[k] * ratio));
    const diff = 100 - Object.values(newWeights).reduce((a, b) => a + b, 0);
    const lastKey = otherKeys.at(-1);
    if (lastKey !== undefined) {
        newWeights[lastKey] += diff;
    }
    setAiWeights(newWeights);
  };

  return (
    <Tabs defaultValue="ai-matching">
      <TabsList className="mb-6">
        <TabsTrigger value="ai-matching"><Brain className="mr-2 h-4 w-4" />AI Matching</TabsTrigger>
        <TabsTrigger value="communication"><Mail className="mr-2 h-4 w-4" />Communication</TabsTrigger>
        <TabsTrigger value="users"><UserCog className="mr-2 h-4 w-4" />User Management</TabsTrigger>
        <TabsTrigger value="security"><ShieldCheck className="mr-2 h-4 w-4" />Security</TabsTrigger>
      </TabsList>

      <TabsContent value="ai-matching">
        <Card>
          <CardHeader>
            <CardTitle>AI Matching Algorithm Settings</CardTitle>
            <CardDescription>Set how matching weights affect suggestions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(aiWeights).map(([key, val]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between">
                  <Label>{key}</Label><Badge variant="outline">{val}%</Badge>
                </div>
                <Slider min={5} max={70} step={5} value={[val]} onValueChange={([v]) => handleWeightChange(key as keyof typeof aiWeights, v)} />
              </div>
            ))}
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Match Threshold</Label><Badge variant="outline">{matchThreshold}%</Badge>
              </div>
              <Slider min={50} max={90} step={5} value={[matchThreshold]} onValueChange={([v]) => setMatchThreshold(v)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Admin Approval</Label>
                <p className="text-sm text-gray-500">Require approval before introductions</p>
              </div>
              <Switch checked={adminApprovalRequired} onCheckedChange={setAdminApprovalRequired} />
            </div>
            <Button onClick={() => saveSettings("ai")}><Save className="mr-2 h-4 w-4" />Save AI Settings</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="communication">
        <Card>
          <CardHeader>
            <CardTitle>Communication Workflow Settings</CardTitle>
            <CardDescription>Manage follow-ups and feedback</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto Follow-up</Label>
                <p className="text-sm text-gray-500">Send follow-up emails automatically</p>
              </div>
              <Switch checked={autoSendFollowUp} onCheckedChange={setAutoSendFollowUp} />
            </div>
            {autoSendFollowUp && (
              <div>
                <Label>Follow-up Delay</Label>
                <Select value={followUpDelay} onValueChange={setFollowUpDelay}>
                  <SelectTrigger><SelectValue placeholder="Days" /></SelectTrigger>
                  <SelectContent>
                    {[1,2,3,5,7].map(d => <SelectItem key={d} value={String(d)}>{d} day{d > 1 ? "s" : ""}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto Feedback</Label>
                <p className="text-sm text-gray-500">Request session feedback automatically</p>
              </div>
              <Switch checked={autoSendFeedback} onCheckedChange={setAutoSendFeedback} />
            </div>
            {autoSendFeedback && (
              <div>
                <Label>Feedback Delay</Label>
                <Select value={feedbackDelay} onValueChange={setFeedbackDelay}>
                  <SelectTrigger><SelectValue placeholder="Days" /></SelectTrigger>
                  <SelectContent>
                    {[0,1,2,3].map(d => <SelectItem key={d} value={String(d)}>{d === 0 ? "Same day" : `${d} day${d > 1 ? "s" : ""}`}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label>Admin Notifications</Label>
              <div className="space-y-2">
                {['New mentee registers', 'New mentor registers', 'New match is generated', 'Feedback is submitted'].map((label, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Checkbox defaultChecked id={`notify-${i}`} />
                    <Label htmlFor={`notify-${i}`} className="text-sm">{label}</Label>
                  </div>
                ))}
              </div>
            </div>
            <Button onClick={() => saveSettings("comm")}><Save className="mr-2 h-4 w-4" />Save Communication Settings</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="users">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage platform roles and permissions</CardDescription>
          </CardHeader>
          <CardContent className="text-center text-gray-500 py-12">
            <UserCog className="h-10 w-10 mx-auto mb-4 text-gray-400" />
            <p>This feature will be available in the next release.</p>
            <Button disabled className="mt-4">Coming Soon</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="security">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Authentication and data handling policies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Password Policy</Label>
              <RadioGroup defaultValue="balanced">
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="basic" id="basic" />
                  <div><Label htmlFor="basic">Basic</Label><p className="text-xs">Min 8 characters</p></div>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="balanced" id="balanced" />
                  <div><Label htmlFor="balanced">Balanced</Label><p className="text-xs">Min 8 chars, mixed case + numbers</p></div>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="strict" id="strict" />
                  <div><Label htmlFor="strict">Strict</Label><p className="text-xs">Min 12 chars, special chars required</p></div>
                </div>
              </RadioGroup>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Session Timeout</Label>
                <p className="text-sm text-gray-500">Auto logout after inactivity</p>
              </div>
              <Select defaultValue="2hours">
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="30min">30 min</SelectItem>
                  <SelectItem value="1hour">1 hour</SelectItem>
                  <SelectItem value="2hours">2 hours</SelectItem>
                  <SelectItem value="4hours">4 hours</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-gray-500">Enforce 2FA for admins</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Data Retention</Label>
                <p className="text-sm text-gray-500">Retention period for inactive data</p>
              </div>
              <Select defaultValue="1year">
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="30days">30 days</SelectItem>
                  <SelectItem value="90days">90 days</SelectItem>
                  <SelectItem value="6months">6 months</SelectItem>
                  <SelectItem value="1year">1 year</SelectItem>
                  <SelectItem value="forever">Forever</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Allow Data Export</Label>
                <p className="text-sm text-gray-500">Users can download their personal data</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Button onClick={() => saveSettings("security")}><Save className="mr-2 h-4 w-4" />Save Security Settings</Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
