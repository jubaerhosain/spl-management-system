"use client";

import { Card, CardContent, Typography, Avatar, Container, Box, Divider } from "@mui/material";

const StudentProfile = ({ data }: { data: any }) => {
  return (
    <Container maxWidth="md">
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "left", mb: 2 }}>
            <Avatar alt={data.name} src={data.avatar} sx={{ width: 100, height: 100 }} />
          </Box>
          <Typography variant="h5" gutterBottom>
            <strong>{data.name}</strong>
          </Typography>
          <Divider />
          <Typography>Roll No: {data.rollNo}</Typography>
          <Typography>
            <strong>Curriculum Year: {data.curriculumYear}</strong>
          </Typography>
          <Typography>Session: {data.session}</Typography>
          <Typography>Email: {data.email}</Typography>
          {data.phone && <Typography>Phone: {data.phone}</Typography>}
          {data.details && (
            <Box sx={{ border: "1px solid #ccc", padding: "10px", marginTop: "20px" }}>
              <Typography variant="h6" gutterBottom>
                Details
              </Typography>
              <Typography>
                {data.details +
                  "lorem ipsum dolor lorem ipsum dolorlorem ipsum dolorlorem ipsum dolorlorem ipsum dolorlorem ipsum dolorlorem ipsum dolorlorem ipsum dolor"}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default StudentProfile;
