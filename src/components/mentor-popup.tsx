"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  User,
  Mail,
  Building,
  Briefcase,
  Calendar,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import { z } from "zod"
import { mentorSchema } from "@/lib/schema"
interface MentorProfileModalProps {
  mentor: z.infer<typeof mentorSchema>
  trigger?: React.ReactNode
}


export default function MentorProfileModal({ mentor, trigger }: MentorProfileModalProps) {
 
  const [open, setOpen] = useState(false)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const StatusBadge = ({ status, label }: { status: boolean | undefined; label: string }) => {
    if (status === undefined) return null

    return (
      <div className="flex items-center gap-2">
        {status ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
        <span className="text-sm text-muted-foreground">{label}</span>
        <Badge variant={status ? "default" : "secondary"}>{status ? "Yes" : "No"}</Badge>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <User className="h-1 w-1" />
            View Profile
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Mentor Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder.svg?height=80&width=80" />
              <AvatarFallback className="text-lg font-semibold">{getInitials(mentor.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div>
                <h2 className="text-2xl font-bold">{mentor.name}</h2>
                {mentor.title && <p className="text-lg text-muted-foreground">{mentor.title}</p>}
                {mentor.organization && (
                  <div className="flex items-center gap-2 mt-1">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{mentor.organization}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${mentor.email}`} className="text-blue-600 hover:underline">
                  {mentor.email}
                </a>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {mentor.active && (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              )}
              {mentor.approved && (
                <Badge variant="default" className="bg-blue-100 text-blue-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Approved
                </Badge>
              )}
            </div>
          </div>

          <Separator />

          {/* Bio Section */}
          {mentor.bio && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{mentor.bio}</p>
              </CardContent>
            </Card>
          )}

          {/* Professional Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Professional Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mentor.industry && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Industry</label>
                    <p className="mt-1">{mentor.industry}</p>
                  </div>
                )}
                {mentor.yearsOfExperience && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Experience</label>
                    <p className="mt-1">{mentor.yearsOfExperience}</p>
                  </div>
                )}
                {mentor.preferredMeetingFormat && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Preferred Meeting Format</label>
                    <p className="mt-1">{mentor.preferredMeetingFormat}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Availability & Booking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mentor.availability && mentor.availability.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Available Times</label>
                    <div className="mt-2 space-y-1">
                      {mentor.availability.map((time, index) => (
                        <Badge key={index} variant="outline" className="mr-2 mb-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {time}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {mentor.bookingLink && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Booking Link</label>
                    <div className="mt-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={mentor.bookingLink} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Schedule Meeting
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Expertise */}
          {mentor.expertise && mentor.expertise.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Areas of Expertise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mentor.expertise.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Status Information */}
          <Card>
            <CardHeader>
              <CardTitle>Status Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <StatusBadge status={mentor.profileCompleted} label="Profile Completed" />
                  <StatusBadge status={mentor.welcomeEmailSent} label="Welcome Email Sent" />
                </div>
                <div className="space-y-3">
                  <StatusBadge status={mentor.active} label="Active Status" />
                  <StatusBadge status={mentor.approved} label="Approved Status" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <label className="font-medium text-muted-foreground">User ID</label>
                  <p className="mt-1">{mentor.user_id || "N/A"}</p>
                </div>
                <div>
                  <label className="font-medium text-muted-foreground">Organization ID</label>
                  <p className="mt-1">{mentor.organization_id}</p>
                </div>
                
              </div>
              
              
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}