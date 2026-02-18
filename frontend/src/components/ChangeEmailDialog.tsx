import { useState } from "react";
import { Shield, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmailOtpDialog } from "./EmailOtpDialog";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  currentEmail: string;
  sendOtp: (newEmail: string) => Promise<void>;
  verifyOtp: (otp: string, newEmail: string) => Promise<void>;
  resendOtp: (newEmail: string) => Promise<void>;
};

export default function ChangeEmailDialog({
  open,
  onOpenChange,
  currentEmail,
  sendOtp,
  verifyOtp,
  resendOtp,
}: Props) {
  const [newEmail, setNewEmail] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async () => {
    if (!newEmail || newEmail !== confirm) {
      setError("Emails must match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await sendOtp(newEmail);
      onOpenChange(false);
      setOtpOpen(true);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !loading && onOpenChange(v)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex gap-2 items-center">
              <Shield className="w-4 h-4" />
              Change Email
            </DialogTitle>
            <DialogDescription>
              We will send a verification OTP to your new email.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Current Email</Label>
              <Input value={currentEmail} disabled className="bg-muted" />
            </div>

            <div>
              <Label>New Email</Label>
              <Input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>

            <div>
              <Label>Confirm New Email</Label>
              <Input
                type="email"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>

            <Button onClick={handleSendOtp} disabled={loading}>
              {loading && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Send OTP
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EmailOtpDialog
        open={otpOpen}
        onOpenChange={setOtpOpen}
        newEmail={newEmail}
        onVerify={(otp) => verifyOtp(otp, newEmail)}
        onResend={() => resendOtp(newEmail)}
      />
    </>
  );
}
