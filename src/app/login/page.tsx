import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
  return (
    <div
      className="bg-cover bg-center min-h-screen flex items-center justify-center"
      style={{ backgroundImage: "url(/login.png)" }}>
      <Card>
        <CardHeader className="items-center">
          <CardTitle className="text-2xl font-bold">Empower Your Vision</CardTitle>
          <CardDescription>
            Unlock opportunities and connect with a community of passionate investors and innovators.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-2 mx-28">
          <p className="self-center">Continue With</p>
          <Button>Continue with Google</Button>
          <Button>Continue with Facebook</Button>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}
