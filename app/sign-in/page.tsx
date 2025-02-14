import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center px-8 py-16 sm:px-12 lg:px-20 bg-background">
      <div className="border bg-card text-card-foreground w-full max-w-3xl p-8 shadow-lg rounded-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sección izquierda - Información adicional */}
          <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-primary/30 via-background to-secondary/30 p-10 rounded-lg">
            <h2 className="text-4xl font-bold text-foreground mb-4">Welcome Back</h2>
            <p className="text-md text-muted-foreground">
              Access your account to continue managing your projects and data securely.
            </p>
          </div>

          {/* Sección derecha - Formulario */}
          <div>
            <div className="flex flex-col p-6 space-y-1 text-center">
              <h3 className="tracking-tight text-3xl font-bold">Sign In</h3>
              <p className="text-sm text-muted-foreground">Log in to your account</p>
            </div>
            <form className="space-y-4" action={signInAction}>
              <CardContent className="p-6 pt-0">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    type="password"
                    name="password"
                    placeholder="Your password"
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex items-center p-6 pt-0">
                <SubmitButton pendingText="Signing In...">Sign in</SubmitButton>
              </CardFooter>
              <FormMessage message={searchParams} />
            </form>
            <p className="text-center mt-6 text-sm text-foreground">
              Don't have an account?{" "}
              <Link href="/sign-up" className="underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
