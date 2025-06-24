import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/header";
import { FingerprintProvider } from './context/fingerPrint';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Biometric Attendance System",
  description: "Secure biometric authentication using advanced fingerprint scanning technology",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        <AuthProvider>
        <FingerprintProvider>
          <Header />
          {children}
          </FingerprintProvider>
        </AuthProvider>
  
      </body>
    </html>
  );
}
