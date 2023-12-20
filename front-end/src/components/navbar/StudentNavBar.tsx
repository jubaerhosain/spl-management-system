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
import { useAuthContext } from "@/contexts/AuthContext";

const pages = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Projects", path: "/projects" },
  { name: "Students", path: "/students" },
  { name: "Teachers", path: "/teachers" },
  { name: "Contact", path: "/contact" },
];

function StudentNavBar() {
  const { user, logout } = useAuthContext();
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

  const handleCloseUserMenu = (event: any, option?: string) => {
    if (option == "logout") {
      logout();
    }
    setAnchorElUser(null);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        borderBottom: "1px solid grey",
        zIndex: 5,
        backgroundColor: "#ecf0f3",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: { xs: "none", md: "flex" }, ml: 2, mr: 1 }}>
            <Image alt="Logo" src="/logo.png" width={50} height={30} />
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
                display: { xs: "block", md: "none", width: 250 },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu} sx={{p: 0}}>
                  <Link
                    href={page.path}
                    key={page.name}
                    onClick={handleCloseNavMenu}
                    style={{ color: "black", display: "block", textDecoration: "none", width: 250, padding: 10 }}
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
                style={{ paddingLeft: 8, paddingRight: 8, color: "black", display: "block" }}
              >
                {page.name}
              </Link>
            ))}
          </Box>

          <Box sx={{ mr: 2, flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, border: 1, borderColor: "blue" }}>
                <Avatar alt={user.name} src={user.avatar} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "40px", width: 250 }}
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
              <MenuItem key="userName" onClick={handleCloseUserMenu} sx={{ p: 0 }}>
                <Link
                  href={"/student/" + user.userId}
                  style={{ textDecoration: "none", color: "black", padding: 10, width: 250, fontWeight: 600 }}
                >
                  {user.name}
                </Link>
              </MenuItem>
              <hr style={{ width: 250 }} />
              <MenuItem onClick={handleCloseUserMenu} sx={{ p: 0 }}>
                <Link
                  href={"/student/" + user.userId + "/account"}
                  style={{ textDecoration: "none", color: "black", width: 250, padding: 10 }}
                >
                  Account
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseUserMenu} sx={{ p: 0 }}>
                <Link
                  href={"/student/" + user.userId + "/settings"}
                  style={{ textDecoration: "none", color: "black", padding: 10, width: 250 }}
                >
                  Settings
                </Link>
              </MenuItem>
              <MenuItem onClick={(e) => handleCloseUserMenu(e, "logout")} sx={{ p: 0 }}>
                <Typography style={{ textDecoration: "none", color: "black", padding: 10, width: 250 }}>
                  Logout
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default StudentNavBar;
