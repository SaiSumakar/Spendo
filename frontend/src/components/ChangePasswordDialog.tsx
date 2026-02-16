import { useState } from "react";
import { Shield, Eye, EyeOff, Loader2 } from "lucide-react";
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

export type ChangePasswordPayload = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (data: ChangePasswordPayload) => Promise<void>;
};

type PasswordInputProps = {
  label: string;
  value: string;
  setValue: (v: string) => void;
  show: boolean;
  setShow: (v: boolean) => void;
};

function PasswordInput({
  label,
  value,
  setValue,
  show,
  setShow,
}: PasswordInputProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="relative">
        <Input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}


export function ChangePasswordDialog({ open, onOpenChange, onSubmit }: Props) {
  const [oldPassword, setOld] = useState("");
  const [newPassword, setNew] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setOld("");
    setNew("");
    setConfirm("");
    setError(null);
  };

  const handleSubmit = async () => {
    setError(null);

    if (!oldPassword || !newPassword || !confirm) {
      setError("All fields are required");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirm) {
      setError("New passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        oldPassword,
        newPassword,
        confirmNewPassword: confirm,
      });
      reset();
      onOpenChange(false);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!loading) onOpenChange(v); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Change Password
          </DialogTitle>
          <DialogDescription>
            Changing your password will require you to sign in again.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <PasswordInput
            label="Current Password"
            value={oldPassword}
            setValue={setOld}
            show={showOld}
            setShow={setShowOld}
          />

          <PasswordInput
            label="New Password"
            value={newPassword}
            setValue={setNew}
            show={showNew}
            setShow={setShowNew}
          />

          <PasswordInput
            label="Confirm New Password"
            value={confirm}
            setValue={setConfirm}
            show={showConfirm}
            setShow={setShowConfirm}
          />

          <p className="text-xs text-muted-foreground">
            Must be at least 6 characters.
          </p>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            disabled={loading}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Update Password
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
