"use client";

import type { Metadata } from "next";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: '#5b4ba4', 
    },
    text: {
      primary: '#5b4ba4', 
      secondary: '#666', 
    },
  },
  typography: {
    fontFamily: "mono sans-serif",
  },
});

import { AuthProvider } from "@/contexts/AuthContext";
import NavBar from "@/components/navbar/NavBar";
import Footer from "@/components/footer/Footer";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import Container from "@mui/material/Container";
import { ToastContainer } from "react-toastify";

const metadata: Metadata = {
  title: "SPL Management System",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Software Project Lab, IIT, University of Dhaka</title>
      </head>
      <body style={{overflowX: "hidden"}}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <AuthProvider>
              <NavBar />
              <Container
                maxWidth="lg"
                sx={{
                  display: "flex",
                  zIndex: -1,
                  bgcolor: "#f1f1f1",
                  minHeight: "100vh",
                  mt: 0.5,
                  mb: 0.5,
                  padding: 1,
                  justifyContent: "center",
                }}
              >
                {children}
              </Container>
              <Footer />
            </AuthProvider>
          </ThemeProvider>
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
