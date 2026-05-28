import { Sora, DM_Sans, JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const sora = Sora({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Jibon | Full-Stack Developer & SaaS Builder",
  description:
    "Passionate Full-Stack Developer specializing in SaaS, AI tools, browser apps, and game development. Building premium digital experiences.",
  keywords: [
    "Full-Stack Developer",
    "SaaS",
    "React",
    "Next.js",
    "AI Tools",
    "Web Development",
  ],
  openGraph: {
    title: "Jibon | Full-Stack Developer & SaaS Builder",
    description:
      "Passionate Full-Stack Developer specializing in SaaS, AI tools, browser apps, and game development.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${dmSans.variable} ${jetbrainsMono.variable} ${playfair.variable} dark`}
    >
      <body className="min-h-screen bg-black text-[#f5f5f5] antialiased">
        <div className="film-grain pointer-events-none fixed inset-0 z-[9999] opacity-[0.035]" />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}