import { signUpAction } from "@/app/actions"
import { FormMessage, Message } from "@/components/shadcn/form-message"
import { SubmitButton } from "@/components/shadcn/submit-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { SmtpMessage } from "../smtp-message"

type SignUpProps = {
  searchParams: Promise<Message>
}

export default async function Signup(props: SignUpProps) {
  const searchParams = await props.searchParams
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-20 max-w-5xl p-5">
      <h1 className="text-4xl font-bold text-center text-gray-800 tracking-tight md:text-5xl">
        <span className="text-purple-700 block mb-5 tracking-tighter">
          Bojana
        </span>
        računovostveni servis
      </h1>
      <form className="flex-1 flex flex-col min-w-64">
        <h1 className="text-2xl font-medium">Registriraj se</h1>
        <p className="text-sm text text-foreground">
          Već imaš napravljen račun?{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Sign in
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            minLength={6}
            required
          />
          <SubmitButton formAction={signUpAction} pendingText="Signing up...">
            Sign up
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
      <SmtpMessage />
    </div>
  )
}
