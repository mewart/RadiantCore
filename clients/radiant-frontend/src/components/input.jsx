// Input.jsx — Basic styled input field component
import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full px-3 py-2 border border-zinc-700 bg-zinc-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-radiant-pulse",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
