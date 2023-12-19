"use client";

import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: "#ecf0f3",
        color: "white",
        borderTop: "1px solid grey",
        boxShadow: "1px 1px 5px 1px grey",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" color="black" sx={{ fontWeight: 200 }} gutterBottom>
              About Us
            </Typography>
            <Typography variant="body2" color="black">
              Your description about the company or project goes here.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" color="black" gutterBottom>
              Contact
            </Typography>
            <Typography variant="body2" color="black">
              Email: iit@iit.du.ac.bd
            </Typography>
            <Typography variant="body2" color="black">
              Phone: +1 (123) 456-7890
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="black" align="center">
            © {new Date().getFullYear()} IIT, University of Dhaka. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
