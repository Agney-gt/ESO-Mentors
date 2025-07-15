"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserPlus, ChevronDown, PlusCircle, Bell } from "lucide-react";
import SignOutButton from "@/components/signOut";

export function PageHeader() {
  return (
    <>
    <div className="w-full fixed top-0 left-0 right-0 z-10 h-15 bg-white shadow">
  {/* Top bar content (dropdowns, icons, etc.) */}




      <div className="mt-4 md:mt-0 flex items-center space-x-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="inline-flex items-center">
              <span>Quick Action</span>
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <a href="/matches/create" className="flex items-center">
                <PlusCircle className="mr-2 h-4 w-4" />
                <span>Create New Match</span>
              </a>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <a href="#" className="flex items-center">
                <UserPlus className="mr-2 h-4 w-4" />
                <span>Invite Users</span>
              </a>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <div className="w-full">
                <SignOutButton />
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div></div>
      </>
  );
}
