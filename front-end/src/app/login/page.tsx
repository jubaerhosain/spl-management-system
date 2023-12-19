"use client";

import React, { useState } from "react";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import FormHelperText from "@mui/material/FormHelperText";
import Link from "next/link";

const LoginForm = () => {
  const [error, setError] = useState<boolean>(false);
  const [email, setEmail] = useState<string | undefined>("");
  const [password, setPassword] = useState<string | undefined>("");

  const handleLogin = () => {
    // Implement your login logic here
    console.log("Logging in with:", { email, password });
    setError(true);
    console.log(process.env.SERVER_URL); 
  };

  return (
    <Paper component="form" elevation={3} sx={{ p: 5, maxWidth: 500, m: "auto", mt: 5 }}>
      <Typography variant="h5" sx={{ mb: 4 }}>
        Login to SPL
      </Typography>
      <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
        <InputLabel htmlFor="email">Email</InputLabel>
        <Input
          fullWidth
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-describedby="email-error"
        />
      </FormControl>

      <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
        <InputLabel htmlFor="password">Password</InputLabel>
        <Input
          fullWidth
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-describedby="email-error"
        />
      </FormControl>
      {error && (
        <FormHelperText error={error} id="email-error">
          Invalid Email or Password
        </FormHelperText>
      )}
      <FormControl fullWidth sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          fullWidth
          onClick={handleLogin}
        >
          Login
        </Button>
      </FormControl>
      <Typography variant="caption" sx={{ display: "block", marginTop: 2 }}>
        <Link
          href="forgot-password"
          onClick={() => console.log("Forgot Password clicked")}
          style={{ display: "block", textAlign: "center", color: "black" }}
        >
          Forgot Password?
        </Link>
      </Typography>
    </Paper>
  );
};

export default LoginForm;
