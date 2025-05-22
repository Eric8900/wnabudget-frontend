"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchCurrentUser, deleteCurrentUser, clearAuth } from "@/lib/middleware/auth";
import { useRouter } from "next/navigation";

export default function Profile() {
  const [email, setEmail] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      const user = await fetchCurrentUser();
      if (user) {
        setEmail(user.email);
      }
    }

    loadUser();
  }, []);

  const handleDeleteAccount = async () => {
    await deleteCurrentUser();
    clearAuth();
    router.push("/login");
  };

  return (
    <>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <span className="cursor-pointer text-text-foreground hover:text-accent transition-colors font-bold">Profile</span>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Your profile</DialogTitle>
            <DialogDescription>View account settings below.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
                type="email"
                disabled
              />
            </div>
          </div>

          <DialogFooter className="flex w-full justify-between pt-6">
            <Button variant="destructive" onClick={() => setOpenConfirmDialog(true)} className="cursor-pointer">Delete Account</Button>
            <Button onClick={() => setOpenDialog(false)} className="cursor-pointer">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={openConfirmDialog} onOpenChange={setOpenConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete your account? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between">
            <Button onClick={() => setOpenConfirmDialog(false)} className="cursor-pointer">Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteAccount} className="cursor-pointer">Yes, Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}