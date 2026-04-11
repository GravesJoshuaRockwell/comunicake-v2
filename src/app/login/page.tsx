"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  async function handleGoogle() {
    setLoading(true);
    await signIn("google", { callbackUrl: "/" });
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Comunicake v2</h1>
          <p className="text-sm text-text-muted mt-1">Mortgage CRM by Rockwell</p>
        </div>

        <div className="bg-white border border-border rounded-2xl p-8 shadow-sm space-y-5">
          <div className="text-center">
            <h2 className="text-lg font-bold text-text-primary">Sign in to continue</h2>
            <p className="text-sm text-text-muted mt-1">Use your @rockwellmtg.com or @bullfit.com account</p>
          </div>

          <button onClick={handleGoogle} disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-border rounded-xl text-sm font-semibold text-text-primary hover:border-primary/40 hover:bg-primary/5 transition-all shadow-sm disabled:opacity-60">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? "Signing in..." : "Continue with Google"}
          </button>

          <div className="text-center">
            <p className="text-xs text-text-muted">
              Access restricted to <span className="font-semibold text-primary">@rockwellmtg.com</span> and <span className="font-semibold text-primary">@bullfit.com</span>
            </p>
          </div>
        </div>

        {/* BullFit auto-access note */}
        <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-xl text-center">
          <p className="text-xs text-text-secondary">
            ⚡ <span className="font-semibold text-primary">@bullfit.com</span> accounts get instant access — no approval needed
          </p>
        </div>
      </div>
    </div>
  );
}
