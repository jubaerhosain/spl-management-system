import type { Metadata } from "next";

import { Inter } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

import { AuthProvider } from "@/contexts/AuthContext";
import NavBar from "@/components/navbar/NavBar";
import Footer from "@/components/footer/Footer";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "SPL Management System",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <AuthProvider>
            <NavBar />
            <Container
              maxWidth="lg"
              sx={{ zIndex: -1, bgcolor: "#f0f0f0", minHeight: "100vh", mt: 0.5, mb: 0.5, padding: 1 }}
            >
              {children}
            </Container>
            <Footer />
          </AuthProvider>
        </AppRouterCacheProvider>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover={false}
          theme="light"
        />
      </body>
    </html>
  );
}
