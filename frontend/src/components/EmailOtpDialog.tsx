import { useEffect, useState } from "react";
import { Loader2, MailCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { OtpInput } from "./OtpInput";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  newEmail: string;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
};

export function EmailOtpDialog({
  open,
  onOpenChange,
  newEmail,
  onVerify,
  onResend,
}: Props) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(60);

  useEffect(() => {
    if (!open) return;
    setResendIn(60);
    const id = setInterval(() => {
      setResendIn((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [open]);

  const handleVerify = async () => {
    if (otp.length !== 6) return;
    setLoading(true);
    try {
      await onVerify(otp);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendIn > 0) return;
    await onResend();
    setResendIn(60);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !loading && onOpenChange(v)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex gap-2 items-center">
            <MailCheck className="w-4 h-4" />
            Verify New Email
          </DialogTitle>

          <DialogDescription>
            OTP sent to <span className="font-medium">{newEmail}</span>
            <br />
            Enter the 6-digit code to continue.
          </DialogDescription>
        </DialogHeader>

        <OtpInput value={otp} onChange={setOtp} />

        <DialogFooter className="flex flex-col gap-3 sm:flex-col">
          <Button onClick={handleVerify} disabled={otp.length !== 6 || loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Confirm Email Change
          </Button>

          <Button
            variant="ghost"
            size="sm"
            disabled={resendIn > 0}
            onClick={handleResend}
          >
            Resend OTP {resendIn > 0 && `(${resendIn}s)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
