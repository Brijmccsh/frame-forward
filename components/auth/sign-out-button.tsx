"use client";

import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { signOut } from "@/lib/auth/actions";

export function SignOutButton({
  children = "Sign out",
  variant = "ghost",
  size = "sm",
  ...props
}: ButtonProps) {
  const [pending, startTransition] = React.useTransition();

  return (
    <Button
      variant={variant}
      size={size}
      loading={pending}
      onClick={() =>
        startTransition(async () => {
          await signOut();
        })
      }
      {...props}
    >
      {children}
    </Button>
  );
}
