export function AuthHeading({ isLogin }: { isLogin: boolean }) {
  return (
    <div className={isLogin ? "mb-6" : "mb-4"}>
      <h1 className="text-xl font-bold leading-[1.15] tracking-tight sm:text-2xl">
        {isLogin ? "Sign In" : "Create Account"}
      </h1>
      <p className="mt-3 text-sm leading-6 text-neutral-500">
        {isLogin
          ? "Sign in to your OmniBot account."
          : "Create your account and start your journey with OmniBot."}
      </p>
    </div>
  );
}
