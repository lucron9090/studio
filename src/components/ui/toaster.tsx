"use client"

import * as React from "react"
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { Button } from "./button";
import { Copy } from "lucide-react";

function ErrorToast({ description, variant }: { description: React.ReactNode, variant?: 'default' | 'destructive' | null }) {
  const [copied, setCopied] = React.useState(false);

  let errorString = '';
  if (description instanceof Error) {
    errorString = description.stack || description.toString();
  } else if (typeof description === 'object' && description !== null) {
    errorString = JSON.stringify(description, null, 2);
  } else {
    errorString = String(description);
  }

  const onCopy = () => {
    navigator.clipboard.writeText(errorString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="grid gap-2">
      <ToastTitle>Error</ToastTitle>
      <ToastDescription asChild>
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{errorString}</code>
        </pre>
      </ToastDescription>
      <Button onClick={onCopy} size="sm" className="w-full mt-2">
        <Copy className="mr-2 h-4 w-4" />
        {copied ? 'Copied!' : 'Copy Error'}
      </Button>
    </div>
  );
}


export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} variant={variant} {...props}>
            {variant === 'destructive' ? (
              <ErrorToast description={description} variant={variant} />
            ) : (
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            )}
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
