import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  console.log("Login page rendering");
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignIn 
        redirectUrl="/dashboard"
        afterSignInUrl="/dashboard"
        signUpUrl="/register"
      />
    </div>
  );
} 