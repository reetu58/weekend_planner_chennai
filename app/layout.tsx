import type { Metadata } from "next";
import "./globals.css";
import Nav from "../components/nav";
import Footer from "../components/footer";

export const metadata: Metadata = {
  title: "Weekendaa — Chennai Weekend Planner",
  description: "Plan your Chennai weekend. Dodge the traffic. Zero cost. Real-time traffic intelligence for residents of Chennai.",
  keywords: ["Chennai", "weekend planner", "traffic", "things to do", "free", "Weekendaa"],
  openGraph: {
    title: "Weekendaa — Chennai Weekend Planner",
    description: "Plan your Chennai weekend. Dodge the traffic. Zero cost.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Weekendaa — Chennai Weekend Planner",
    description: "Plan your Chennai weekend. Dodge the traffic. Zero cost.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700;9..40,900&family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&display=swap" rel="stylesheet" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="font-sans antialiased bg-sand text-gray-900 min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
