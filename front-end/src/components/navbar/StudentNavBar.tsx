"use client";

import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Tooltip,
  Avatar,
  MenuItem,
  Container,
} from "@mui/material";

import * as React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import Image from "next/image";
import Link from "next/link";

const pages = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Projects", path: "/projects" },
  { name: "Students", path: "/students" },
  { name: "Teachers", path: "/teachers" },
  { name: "Contact", path: "/contact" },
];

const settings = [
  { name: "Profile", path: "/" },
  { name: "Account", path: "/" },
  { name: "Logout", path: "auth/logout" },
];

function StudentNavBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event: any) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event: any) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar
      position="relative"
      sx={{ borderBottom: "1px solid grey", zIndex: 5, backgroundColor: "#ecf0f3", height: "10vh" }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: { xs: "none", md: "flex" }, ml: 2, mr: 1 }}>
            <Image alt="Logo" src="/logo.png" width={60} height={40} />
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontWeight: 600,
              color: "black",
              textDecoration: "none",
            }}
          >
            Software Project Lab
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
                  {/* <Typography textAlign="center">{page.name}</Typography> */}
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
                style={{ padding: 8, color: "black", display: "block" }}
              >
                {page.name}
              </Link>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting.name} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default StudentNavBar;
