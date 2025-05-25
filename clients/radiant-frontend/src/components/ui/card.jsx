import * as React from "react";

const Card = ({ className = "", ...props }) => (
  <div className={`rounded-2xl bg-zinc-900 shadow-inner-glow ${className}`} {...props} />
);

const CardContent = ({ className = "", ...props }) => (
  <div className={`p-4 ${className}`} {...props} />
);

export { Card, CardContent };
