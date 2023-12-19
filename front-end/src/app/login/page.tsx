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
import axiosInstance from "@/api/axiosInstance";
import { toast } from "react-toastify";
import { useAuthContext } from "@/contexts/AuthContext";
import withoutAuth from "@/hooks/withoutAuth";

const Login = () => {
  const [error, setError] = useState<any | boolean>(false);
  const [email, setEmail] = useState<string | undefined>("");
  const [password, setPassword] = useState<string | undefined>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { login } = useAuthContext();

  const onEmailChange = (e: any) => {
    setError((prevState: any) => {
      const newState = prevState;
      delete newState.email;
      return newState;
    });
    setEmail(e.target.value);
  };

  const onPasswordChange = (e: any) => {
    setError((prevState: any) => {
      const newState = prevState;
      delete newState.password;
      return newState;
    });
    setPassword(e.target.value);
  };

  const onSubmit = () => {
    console.log(isLoading);
    if (isLoading) return;
    setIsLoading((prevState) => !prevState);

    const tempError: any = {};
    if (!email) {
      tempError.email = "Email must be provided";
    }

    if (!password) {
      tempError.password = "Password must be provided";
    }

    if (Object.keys(tempError).length != 0) {
      setError(tempError);
      setIsLoading((prevState) => !prevState);
    } else {
      axiosInstance
        .post("login", { email, password })
        .then((data) => {
          if (data?.success) {
            toast.success("Logged in successfully");
          } else {
            if (data?.error) setError(data.error);
            else if (data) toast.error(data.message);
          }
        })
        .finally(() => {
          setIsLoading((prevState) => !prevState);
        });
    }
    setError(false);
  };

  return (
    <Paper component="form" noValidate={false} elevation={3} sx={{ p: 5, maxWidth: 500, m: "auto", mt: 5 }}>
      <Typography variant="h5" sx={{ mb: 4 }}>
        Login to SPL
      </Typography>
      <FormControl error={error?.email ? true : false} variant="standard" fullWidth sx={{ mb: 2 }}>
        <InputLabel htmlFor="email">Email</InputLabel>
        <Input
          fullWidth
          type="email"
          id="email"
          value={email}
          onChange={onEmailChange}
          aria-describedby="email-error"
        />
        {error?.email && (
          <FormHelperText error={error?.email ? true : false} id="email-error">
            {error?.email}
          </FormHelperText>
        )}
      </FormControl>

      <FormControl error={error?.password ? true : false} variant="standard" fullWidth sx={{ mb: 2 }}>
        <InputLabel htmlFor="password">Password</InputLabel>
        <Input
          fullWidth
          type="password"
          id="password"
          value={password}
          onChange={onPasswordChange}
          aria-describedby="password-error"
        />
        {error?.password && (
          <FormHelperText error={error?.password ? true : false} id="password-error">
            {error?.password}
          </FormHelperText>
        )}
      </FormControl>
      {error?.message && (
        <FormHelperText error={error?.message ? true : false} id="custom error">
          Invalid Email or Password
        </FormHelperText>
      )}
      <FormControl fullWidth sx={{ mt: 2 }}>
        <Button variant="outlined" fullWidth onClick={onSubmit}>
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

export default withoutAuth(Login);
