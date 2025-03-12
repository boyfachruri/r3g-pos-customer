"use client"

import { Box, Typography, Container } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      marginTop={5}
      sx={{
        // mt: "auto",
        py: 2,
        backgroundColor: "#f5f5f5",
        backgroundImage: 'url("/background.jpg")',
        color: "#fff",
        // textAlign: "center",
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" fontWeight="500">
          © {new Date().getFullYear()} R3g Software. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
