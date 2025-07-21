"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Mail, MapPin, User, Briefcase, Target, Clock, CheckCircle, XCircle } from "lucide-react"


function MentorDialog({ mentor }: { mentor: any }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="p-0 h-auto font-medium text-blue-600 hover:text-blue-800">
          {mentor.name}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Mentor Profile
          </DialogTitle>
          <DialogDescription>Detailed information about {mentor.name}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{mentor.name}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                {mentor.title} at {mentor.organization}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{mentor.email}</span>
              </div>

              <div>
                <h4 className="font-medium mb-2">Bio</h4>
                <p className="text-sm text-muted-foreground">{mentor.bio}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Industry & Experience</h4>
                <div className="flex gap-2 mb-2">
                  <Badge variant="secondary">{mentor.industry}</Badge>
                  <Badge variant="outline">{mentor.years_of_experience} years</Badge>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Expertise</h4>
                <div className="flex flex-wrap gap-2">
                  {mentor.expertise.map((skill: string, index: number) => (
                    <Badge key={index} variant="default">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Availability
                </h4>
                <div className="space-y-1">
                  {mentor.availability.map((slot: string, index: number) => (
                    <div key={index} className="text-sm text-muted-foreground">
                      {slot}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Meeting Preference
                </h4>
                <Badge variant="outline">{mentor.preferred_meeting_format}</Badge>
              </div>

              <div>
                <h4 className="font-medium mb-2">Status</h4>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1">
                    {mentor.active ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm">{mentor.active ? "Active" : "Inactive"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {mentor.approved ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-yellow-500" />
                    )}
                    <span className="text-sm">{mentor.approved ? "Approved" : "Pending Approval"}</span>
                  </div>
                </div>
              </div>

              {mentor.booking_link && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Booking Link
                  </h4>
                  <a
                    href={mentor.booking_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    {mentor.booking_link}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function MenteeDialog({ mentee }: { mentee: any }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="p-0 h-auto font-medium text-blue-600 hover:text-blue-800">
          {mentee.name}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Mentee Profile
          </DialogTitle>
          <DialogDescription>Detailed information about {mentee.name}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{mentee.name}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {mentee.email}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Background</h4>
                <p className="text-sm text-muted-foreground">{mentee.background}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Goals
                </h4>
                <p className="text-sm text-muted-foreground">{mentee.goals}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Industry</h4>
                <Badge variant="secondary">{mentee.industry}</Badge>
              </div>

              <div>
                <h4 className="font-medium mb-2">Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {mentee.interests.map((interest: string, index: number) => (
                    <Badge key={index} variant="default">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Availability
                </h4>
                <div className="space-y-1">
                  {mentee.availability.map((slot: string, index: number) => (
                    <div key={index} className="text-sm text-muted-foreground">
                      {slot}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Meeting Preference
                </h4>
                <Badge variant="outline">{mentee.preferred_meeting_format}</Badge>
              </div>

              <div>
                <h4 className="font-medium mb-2">Status</h4>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1">
                    {mentee.active ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm">{mentee.active ? "Active" : "Inactive"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {mentee.approved ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-yellow-500" />
                    )}
                    <span className="text-sm">{mentee.approved ? "Approved" : "Pending Approval"}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
type MatchesTableProps = {
    enrichedMatches: any[];// eslint-disable-line @typescript-eslint/no-explicit-any
  };
export default function MentorMatchesTable({enrichedMatches}: MatchesTableProps) { 
  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mentor Name</TableHead>
              <TableHead>Mentee Name</TableHead>
              <TableHead>Match Score</TableHead>
              <TableHead>Match Reasons</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enrichedMatches.map((match) => (
              <TableRow key={match.id}>
                <TableCell>
                  <MentorDialog mentor={match.mentor} />
                </TableCell>
                <TableCell>
                  <MenteeDialog mentee={match.mentee} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{match.match_score}%</div>
                    <div className={`h-2 w-16 rounded-full bg-gray-200`}>
                      <div
                        className={`h-2 rounded-full ${
                          match.match_score >= 80
                            ? "bg-green-500"
                            : match.match_score >= 60
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${match.match_score}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {match.match_reasons.map((reason : any, index : number) => (   // eslint-disable-line @typescript-eslint/no-explicit-any
                      <Badge key={index} variant="outline" className="text-xs">
                        {reason}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant={match.status === "pending" ? "secondary" : "default"} className="capitalize">
                    {match.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
