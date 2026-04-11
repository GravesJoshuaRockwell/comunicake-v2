import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const ALLOWED_DOMAINS = ["rockwellmtg.com", "bullfit.com"];
const BULLFIT_DOMAINS = ["bullfit.com"];

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user }) {
      const email = user.email?.toLowerCase() || "";
      const domain = email.split("@")[1];
      // Allow all Rockwell and BullFit emails
      return ALLOWED_DOMAINS.includes(domain);
    },
    async session({ session }) {
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "comunicake-v2-secret-2026",
});

export { handler as GET, handler as POST };
