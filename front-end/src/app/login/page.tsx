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
  const { login } = useAuthContext();
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<any>("");
  const [password, setPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<any>("");
  const [commonError, setCommonError] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onEmailChange = (e: any) => {
    setEmailError(null);
    setCommonError(null);
    setEmail(e.target.value);
  };

  const onPasswordChange = (e: any) => {
    setPasswordError(null);
    setCommonError(null);
    setPassword(e.target.value);
  };

  const onSubmit = () => {
    const tempError: any = {};

    if (!email) {
      tempError.email = "email must be provided";
    }

    if (!password) {
      tempError.password = "password must be provided";
    }

    if (Object.keys(tempError).length != 0) {
      setEmailError(tempError.email);
      setPasswordError(tempError.password);
      return;
    }

    if (isLoading) return;
    setIsLoading((prevState) => !prevState);

    axiosInstance
      .post("/auth/login", { email, password })
      .then((response) => {
        const data = response.data;
        if (data?.success) {
          toast.success("Logged in successfully");
          login(data.data);
        }
      })
      .catch((error) => {
        if (!error.response) {
          toast.error(error.message);
          return;
        }
        const data = error.response?.data;
        if (data?.error) {
          setEmailError(data.error.email?.msg);
          setPasswordError(data.error.password?.msg);
        } else if (data) setCommonError(data.message);
      })
      .finally(() => {
        setIsLoading((prevState) => !prevState);
      });
  };

  return (
    <Paper component="form" noValidate={false} elevation={3} sx={{ p: 5, maxWidth: 500, m: "auto", mt: "20vh" }}>
      <Typography variant="h5" sx={{ mb: 4 }}>
        Login to SPL
      </Typography>
      <FormControl error={emailError ? true : false} variant="standard" fullWidth sx={{ mb: 2 }}>
        <InputLabel htmlFor="email">Email</InputLabel>
        <Input
          fullWidth
          type="email"
          id="email"
          value={email}
          onChange={onEmailChange}
          aria-describedby="email-error"
        />
        {emailError && (
          <FormHelperText error={emailError ? true : false} id="email-error">
            {emailError}
          </FormHelperText>
        )}
      </FormControl>

      <FormControl error={passwordError ? true : false} variant="standard" fullWidth sx={{ mb: 2 }}>
        <InputLabel htmlFor="password">Password</InputLabel>
        <Input
          fullWidth
          type="password"
          id="password"
          value={password}
          onChange={onPasswordChange}
          aria-describedby="password-error"
        />
        {passwordError && (
          <FormHelperText error={passwordError ? true : false} id="password-error">
            {passwordError}
          </FormHelperText>
        )}
      </FormControl>

      {commonError && (
        <FormHelperText error={commonError ? true : false} id="custom error">
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
          style={{ display: "block", textAlign: "center", color: "black", fontSize: 14 }}
        >
          Forgot Password?
        </Link>
      </Typography>
    </Paper>
  );
};

export default withoutAuth(Login);
