import { Inter, Archivo_Narrow } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

// Configure Inter (replacing Geist Sans for body text)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Configure Archivo Narrow (Notice the underscore in Next.js font imports)
const archivoNarrow = Archivo_Narrow({
  variable: "--font-archivo-narrow",
  subsets: ["latin"],
  weight: ["400", "600", "700"], // Archivo Narrow requires explicit weights
  style: ["normal", "italic"],
});

export const metadata = {
  title: "ElevateX - The Next Level of Fitness",
  description: "The Next Level of Fitness",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${archivoNarrow.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#131313] text-[#e5e2e1]">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
