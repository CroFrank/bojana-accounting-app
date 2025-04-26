"use client"

import { useToast } from "../hooks/use-toast"

export function ToastSimple({ msg }: { msg: string }) {
  const { toast } = useToast()

  return toast({
    description: msg,
  })
}
