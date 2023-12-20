"use client"

import { Card, CardContent, Typography, Avatar, Container, Box } from "@mui/material";

const StudentProfile = ({ data }: { data: any }) => {
  console.log(data);
  return (
    <Container maxWidth="md">
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Avatar alt={data.name} src={data.avatar} sx={{ width: 100, height: 100 }} />
          </Box>
          <Typography variant="h5" gutterBottom>
            {data.name}
          </Typography>
          <Typography color="textSecondary">Roll No: {data.rollNo}</Typography>
          <Typography color="textSecondary">
            <strong>Curriculum Year: {data.curriculumYear}</strong>
          </Typography>
          <Typography color="textSecondary">Session: {data.session}</Typography>
          <Typography color="textSecondary">Email: {data.email}</Typography>
          {data.phone && <Typography color="textSecondary">Phone: {data.phone}</Typography>}
          {data.details && (
            <Box sx={{ border: "1px solid #ccc", padding: "10px", marginTop: "20px" }}>
              <Typography variant="h6" gutterBottom>
                Details
              </Typography>
              <Typography>{data.details}</Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default StudentProfile;
