import React from "react";
import { cn } from "shared/lib/cn";

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "ghost";
  }
> = ({ className, variant = "primary", ...props }) => (
  <button
    className={cn(
      "btn",
      variant === "primary" ? "btn-primary" : "hover:bg-white/5",
      className
    )}
    {...props}
  />
);
