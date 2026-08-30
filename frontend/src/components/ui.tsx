import { cn } from "../lib/utils";

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "private";
  className?: string;
}) {
  const variants = {
    default: "bg-white/5 text-white/70 border-white/10",
    success: "bg-white/8 text-white/85 border-white/15",
    warning: "bg-white/6 text-white/75 border-white/12",
    danger: "bg-white/5 text-white/70 border-white/10",
    private: "bg-white/6 text-white/80 border-white/12",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium backdrop-blur-md",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("glass-panel rounded-2xl p-6", className)}>
      {children}
    </div>
  );
}

export function Button({
  children,
  onClick,
  disabled,
  variant = "primary",
  className,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  type?: "button" | "submit";
}) {
  const variants = {
    primary:
      "bg-white/12 hover:bg-white/18 text-white border border-white/20 shadow-lg shadow-black/30 backdrop-blur-md",
    secondary:
      "glass-panel hover:bg-white/10 text-white/85 border-white/12",
    ghost: "bg-transparent hover:bg-white/6 text-white/60 hover:text-white/90 border border-transparent",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50",
        variants[variant],
        className
      )}
    >
      {children}
    </button>
  );
}
