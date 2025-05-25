import * as React from "react";

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={`flex w-full rounded-md border border-zinc-700 bg-zinc-800 p-2 text-sm text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-radiant-pulse ${className}`}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
