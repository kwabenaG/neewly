import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  console.log("Register page rendering");
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignUp 
        redirectUrl="/dashboard"
        afterSignUpUrl="/dashboard"
        signInUrl="/login"
      />
    </div>
  );
} 