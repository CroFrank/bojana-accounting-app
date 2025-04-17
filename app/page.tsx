import { signInAction } from "@/app/actions"
import { FormMessage, Message } from "@/components/shadcn/form-message"
import { SubmitButton } from "@/components/shadcn/submit-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

type SignInProps = {
  searchParams: Promise<Message>
}

export default async function Home(props: SignInProps) {
  const searchParams = await props.searchParams

  return (
    <div className="flex flex-col gap-20 max-w-5xl p-5">
      <h1 className="text-4xl font-bold text-center text-gray-800 tracking-tight md:text-5xl">
        <span className="text-purple-700 block mb-5 tracking-tighter">
          Bojana
        </span>
        računovostveni servis
      </h1>{" "}
      <form className="flex-1 flex flex-col min-w-64">
        <h1 className="text-2xl font-medium">Sign in</h1>
        <p className="text-sm text-foreground">
          Nemaš izrađen račun?{" "}
          <Link
            className="text-foreground font-medium underline"
            href="/sign-up"
          >
            Registriraj se
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Lozinka</Label>
            <Link
              className="text-xs text-foreground underline"
              href="/forgot-password"
            >
              Zaboravljena lozinka?
            </Link>
          </div>
          <Input
            type="password"
            name="password"
            placeholder="Vaša lozinka"
            required
          />
          <SubmitButton pendingText="Signing In..." formAction={signInAction}>
            Sign in
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </div>
  )
}
