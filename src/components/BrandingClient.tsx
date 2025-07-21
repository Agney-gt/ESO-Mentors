"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HexColorPicker } from "react-colorful";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Paintbrush, Save, RefreshCw } from "lucide-react";

type Props = {
  organization: {
    id: number;
    name: string;
    location: string;
    about: string;
    logo: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
};

export default function BrandingClient({ organization }: Props) {
  const router = useRouter();

  const [name, setName] = useState(organization.name);
  const [location, setLocation] = useState(organization.location);
  const [about, setAbout] = useState(organization.about);
  const [logoUrl, setLogoUrl] = useState(organization.logo);
  const [primaryColor, setPrimaryColor] = useState(organization.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(organization.secondaryColor);
  const [accentColor, setAccentColor] = useState(organization.accentColor);

  const [isSaving, setIsSaving] = useState(false);
  const [showPrimaryPicker, setShowPrimaryPicker] = useState(false);
  const [showSecondaryPicker, setShowSecondaryPicker] = useState(false);
  const [showAccentPicker, setShowAccentPicker] = useState(false);
  const [previewMode, setPreviewMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    document.body.classList.add("branded");
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setLogoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setPrimaryColor("#3B82F6");
    setSecondaryColor("#8B5CF6");
    setAccentColor("#10B981");
    toast(

 "Colors reset to defaults. Save to apply."
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/organization", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          location,
          about,
          logo: logoUrl,
          primaryColor,
          secondaryColor,
          accentColor,
        }),
      });

      if (!res.ok) throw new Error("Failed to update organization");

      toast(
        "Your branding changes have been applied."
      );

      router.refresh(); // Refresh server props
    } catch (error: any) {// eslint-disable-line @typescript-eslint/no-explicit-any
      toast(

`${error?.message} || "Unexpected error occurred."`

      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>

        <title>Branding | Mentor Match Platform</title>


      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Branding</h1>
          <p className="text-sm text-gray-500">Customize your platform appearance</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReset} disabled={isSaving}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin border-2 border-white border-r-transparent rounded-full" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Organization Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div>
                <Label>Location</Label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>

              <div>
                <Label>About</Label>
                <Textarea value={about} onChange={(e) => setAbout(e.target.value)} rows={3} />
              </div>

              <div>
                <Label>Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 border rounded flex justify-center items-center overflow-hidden">
                    {logoUrl ? (
                      <img src={logoUrl} alt="logo" className="max-w-full max-h-full object-contain" />
                    ) : (
                      <Paintbrush className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <Input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById("logo-upload")?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Logo
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* COLOR PICKERS */}
          <Card>
            <CardHeader>
              <CardTitle>Color Scheme</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[{ label: "Primary", value: primaryColor, setter: setPrimaryColor, toggle: showPrimaryPicker, setToggle: setShowPrimaryPicker },
                { label: "Secondary", value: secondaryColor, setter: setSecondaryColor, toggle: showSecondaryPicker, setToggle: setShowSecondaryPicker },
                { label: "Accent", value: accentColor, setter: setAccentColor, toggle: showAccentPicker, setToggle: setShowAccentPicker }]
                .map(({ label, value, setter, toggle, setToggle }, i) => (
                  <div key={i}>
                    <Label>{label} Color</Label>
                    <div className="relative">
                      <div className="flex">
                        <div
                          className="w-10 h-10 rounded-l-md border border-r-0"
                          style={{ backgroundColor: value }}
                          onClick={() => setToggle(!toggle)}
                        />
                        <Input value={value} onChange={(e) => setter(e.target.value)} className="rounded-l-none" />
                      </div>
                      {toggle && (
                        <div className="absolute z-10 mt-2">
                          <HexColorPicker color={value} onChange={setter} />
                          <div className="flex justify-end mt-2">
                            <Button size="sm" onClick={() => setToggle(false)}>
                              Apply
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT SIDE PREVIEW */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={previewMode} onValueChange={(v) => setPreviewMode(v as "light" | "dark")}>
                <TabsList className="mb-4">
                  <TabsTrigger value="light">Light</TabsTrigger>
                  <TabsTrigger value="dark">Dark</TabsTrigger>
                </TabsList>
              </Tabs>

              <div
                className={`rounded border p-4 ${previewMode === "dark" ? "bg-gray-900 text-white" : "bg-white"}`}
              >
                <div className="flex items-center mb-4 border-b pb-2">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="h-8 mr-2" />
                  ) : (
                    <div className="font-semibold text-lg" style={{ color: primaryColor }}>
                      {name || "Organization"}
                    </div>
                  )}
                </div>
                <h3 className="font-semibold" style={{ color: primaryColor }}>
                  Welcome to your mentor platform!
                </h3>
                <p className="text-sm">This preview shows your current branding.</p>
                <Button
                  size="sm"
                  style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
                  className="w-full mt-4"
                >
                  Primary
                </Button>
                <Button
                  size="sm"
                  style={{ backgroundColor: secondaryColor, borderColor: secondaryColor }}
                  className="w-full mt-2"
                >
                  Secondary
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Actual styling may vary across the site.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
