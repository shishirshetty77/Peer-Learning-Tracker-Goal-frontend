import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Goal Tracker App",
  description: "Track your peer learning goals with ease",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          font-sans 
          bg-white 
          text-black 
          antialiased
          dark:bg-black 
          dark:text-white
        `}
      >
        {children}
      </body>
    </html>
  );
}