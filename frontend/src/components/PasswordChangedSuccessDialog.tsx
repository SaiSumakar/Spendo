import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

type Props = {
  open: boolean;
  seconds: number;
  onContinue: () => void;
};

export function PasswordChangedSuccessDialog({ open, seconds, onContinue }: Props) {
  return (
    <Dialog open={open}>
        <DialogContent
            onInteractOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
        >
            <DialogHeader>
            <DialogTitle className="flex gap-2 items-center justify-start mb-2">
                <ShieldCheck />
                Password Changed Successfully
            </DialogTitle>
            <DialogDescription>
                You'll be logged out for security reasons.
                <br />
                Redirecting to login in <b>{seconds}s</b>.
            </DialogDescription>
            </DialogHeader>

            <DialogFooter>
            <Button onClick={onContinue} className="w-full">
                Login Now
            </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  );
}
