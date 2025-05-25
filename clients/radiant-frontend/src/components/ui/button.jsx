import * as React from "react";
import { cn } from "@/lib/utils";

const Button = React.forwardRef(({ className, variant = "default", isActive = false, ...props }, ref) => {
  const base =
    "inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    default: "bg-radiant-glow text-black hover:bg-radiant-flame shadow-outer-glow",
    ghost: "bg-transparent hover:bg-zinc-800 text-white border border-zinc-700",
    outline: "border border-zinc-700 text-white hover:bg-zinc-800",
  };

  const activeStyles = {
    ghost: "bg-zinc-800 text-radiant-glow border-radiant-flame",
    outline: "bg-zinc-800 text-radiant-glow border-radiant-flame",
    default: "", // Already styled enough
  };

  const variantClass = variants[variant] || variants.default;
  const activeClass = isActive ? activeStyles[variant] || "" : "";

  return (
    <button
      ref={ref}
      className={cn(base, variantClass, activeClass, className)}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button };
