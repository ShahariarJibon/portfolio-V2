import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const DEFAULT_WORKS = [
  {
    id: "work-1",
    title: "AI TRANSLATOR",
    description: "Real-time AI-powered translation platform with support for 100+ languages, voice input, and document translation.",
    image_url: "/vasha.png",
    tag_lines: ["JavaScript", "HTML", "CSS", "API"],
    demo_url: "https://shahariarjibon.github.io/Translator-VASHA/",
    code_url: "https://github.com/ShahariarJibon/Translator-VASHA",
    sort_order: 0,
    published: true,
  },
  {
    id: "work-2",
    title: "PixeLoom - Online Photo Editor",
    description: "A powerful web-based photo editing application with filters, adjustments, layers, and export capabilities.",
    image_url: "/imagedo.png",
    tag_lines: ["React", "Canvas API", "Tailwind"],
    demo_url: "https://online-image-editor-zeta.vercel.app/",
    code_url: "https://github.com/ShahariarJibon/Online-Image-Editor",
    sort_order: 1,
    published: true,
  },
  {
    id: "work-3",
    title: "Territory Multiplayer game",
    description: "Real-time multiplayer game with WebSocket, game state synchronization, and competitive matchmaking.",
    image_url: "/territory.png",
    tag_lines: ["Node.js", "Socket.io", "React", "Redis"],
    demo_url: "https://territory-game-multiplayer-production.up.railway.app/",
    code_url: "https://github.com/ShahariarJibon/Territory-Game-Multiplayer",
    sort_order: 2,
    published: true,
  },
  {
    id: "work-4",
    title: "LunaQR - QR Generator",
    description: "A sleek and modern QR code generator that creates customizable QR codes for URLs, text, and more with instant download.",
    image_url: "/lunaqr.png",
    tag_lines: ["React", "QR Code API", "Tailwind"],
    demo_url: "https://luna-qr.vercel.app/",
    code_url: "https://github.com/ShahariarJibon/LunaQR",
    sort_order: 3,
    published: true,
  },
];

export async function GET() {
  try {
    const supabase = getSupabase();

    const fetchPromise = supabase
      .from("works")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 1500)
    );

    const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

    if (!error && data && data.length > 0) {
      return NextResponse.json({ works: data });
    }
    return NextResponse.json({ works: DEFAULT_WORKS });
  } catch {
    return NextResponse.json({ works: DEFAULT_WORKS });
  }
}
