import { useRef } from "react";
import { Input } from "@/components/ui/input";

type Props = {
  value: string;
  onChange: (v: string) => void;
  length?: number;
};

export function OtpInput({ value, onChange, length = 6 }: Props) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const setDigit = (i: number, d: string) => {
    if (!/^\d?$/.test(d)) return;

    const next = value.split("");
    next[i] = d;
    const joined = next.join("").slice(0, length);
    onChange(joined);

    if (d && refs.current[i + 1]) {
      refs.current[i + 1]!.focus();
    }
  };

  const onKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !value[i] && refs.current[i - 1]) {
      refs.current[i - 1]!.focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, i) => (
        <Input
          key={i}
          ref={(el) => {refs.current[i] = el}}
          value={value[i] || ""}
          onChange={(e) => setDigit(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
          className="w-12 h-12 text-center text-lg font-mono"
          maxLength={1}
          inputMode="numeric"
        />
      ))}
    </div>
  );
}
