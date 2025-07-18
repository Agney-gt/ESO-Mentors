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
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { z } from "zod"
import { menteeSchema } from "@/lib/schema"
interface MentorProfileModalProps {
  mentee: z.infer<typeof menteeSchema>
  trigger?: React.ReactNode
}


export default function MenteeProfileModal({ mentee, trigger }: MentorProfileModalProps) {
  console.log("Mentee Profile Data:", mentee)
  
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

       
          {/* Header Section */}
          <div className='flex flex-col'>
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder.svg?height=80&width=80" />
              <AvatarFallback className="text-lg font-semibold">{getInitials(mentee.name)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <div>
                <h2 className="text-2xl font-bold">{mentee.name}</h2>

                {(
                  <div className="flex items-center gap-2 mt-1">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{mentee.industry}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${mentee.email}`} className="text-blue-600 hover:underline">
                  {mentee.email}
                </a>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              {mentee.active && (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              )}
              
            </div>
          </div>
          
        
          
          
          <Separator />
              <div className='mt-4'>
          {/* Bio Section */}
          <Card>
              <CardHeader>
                <CardTitle className="flex flex col items-center gap-2">
                  <User className="h-5 w-5" />
                  Interests
                </CardTitle>
              </CardHeader>
              <CardContent>
                {mentee.interests?.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="mr-2 mb-1">
                    {skill}</Badge>
                )) || <span className="text-muted-foreground">No interests provided</span>}
              </CardContent>
            </Card>
            </div>
     
          {/* Professional Details */}
     
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  More Details
                </CardTitle>
              </CardHeader>
           
                {mentee.goals && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Experience</label>
                    <p className="mt-1">{mentee.goals}</p>
                  </div>
                )}
                {mentee.preferredMeetingFormat && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Preferred Meeting Format</label>
                    <p className="mt-1">{mentee.preferredMeetingFormat}</p>
                  </div>
                )}
         
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Availability & Booking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mentee.availability && mentee.availability.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Available Times</label>
                    <div className="mt-2 space-y-1">
                      {mentee.availability.map((time, index) => (
                        <Badge key={index} variant="outline" className="mr-2 mb-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {time}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
              </CardContent>
            </Card>
          </div>

         

          {/* Status Information */}
          <Card>
            <CardHeader>
              <CardTitle>Status Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <StatusBadge status={mentee.profileCompleted} label="Profile Completed" />
                  <StatusBadge status={mentee.welcomeEmailSent} label="Welcome Email Sent" />
                </div>
                <div className="space-y-3">
                  <StatusBadge status={mentee.active} label="Active Status" />
                  <StatusBadge status={mentee.approved} label="Approved Status" />
                </div>
              </div>
            </CardContent>
          </Card>


          </div>       
            
      </DialogContent>
    </Dialog>
  )
}