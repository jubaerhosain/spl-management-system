"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import Image from "next/image";
import Link from "next/link";

const pages = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

function PublicNavBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event: any) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar
      position="relative"
      sx={{ borderBottom: "1px solid grey", zIndex: 5, backgroundColor: "#ecf0f3", height: "10vh" }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: { xs: "none", md: "flex" }, ml: 2, mr: 1 }}>
            <Image alt="Logo" src="/logo.png" width={50} height={40} />
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontWeight: 900,
              color: "#5b4ba4",
              textDecoration: "none",
            }}
          >
            SPL
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ color: "black" }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none", width: 300 },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu} sx={{ width: 500 }}>
                  <Link
                    href={page.path}
                    key={page.name}
                    onClick={handleCloseNavMenu}
                    style={{ color: "black", display: "block" }}
                  >
                    {page.name}
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" }, ml: 2, mr: 1 }}>
            <Image alt="Logo" src="/logo.png" width={60} height={40} />
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "black",
              textDecoration: "none",
            }}
          >
            SPL
          </Typography>
          <Box sx={{ flexGrow: 1, justifyContent: "center", display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Link
                href={page.path}
                key={page.name}
                onClick={handleCloseNavMenu}
                style={{ padding: 8, color: "var(--primary-color)", display: "block" }}
              >
                {page.name}
              </Link>
            ))}
          </Box>

          <Box sx={{ mr: 2, color: "white", display: "block" }}>
            <Link href="login" style={{ color: "var(--primary-color)", fontSize: 18, fontWeight: "500", textDecoration: "none" }}>
              Login
            </Link>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default PublicNavBar;
