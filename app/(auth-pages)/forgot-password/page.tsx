import { forgotPasswordAction } from "@/app/actions"
import { FormMessage, Message } from "@/components/shadcn/form-message"
import { SubmitButton } from "@/components/shadcn/submit-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { SmtpMessage } from "../smtp-message"

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>
}) {
  const searchParams = await props.searchParams
  return (
    <div className="flex flex-col gap-20 max-w-5xl p-5">
      <form className="flex-1 flex flex-col w-full gap-2 text-foreground [&>input]:mb-6 min-w-64  mx-auto">
        <div>
          <h1 className="text-2xl font-medium">Zaboravljena lozinka</h1>
          <p className="text-sm text-secondary-foreground">
            Već imaš izrađen račun?{" "}
            <Link className="text-primary underline" href="/">
              Sign in
            </Link>
          </p>
        </div>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          <SubmitButton formAction={forgotPasswordAction}>
            Obnovi Lozinku
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
      <SmtpMessage />
    </div>
  )
}
