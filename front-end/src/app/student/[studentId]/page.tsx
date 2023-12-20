"use client";

import fetcher from "@/api/fetcher";
import withAuth from "@/hooks/withAuth";
import { useParams } from "next/navigation";
import useSWR from "swr";
import StudentProfile from "@/components/card/student-profile/StudentProfile";
import { Grid } from "@mui/material";

const Student = () => {
  const { studentId } = useParams();
  const { data, isLoading } = useSWR(`/student/${studentId}`, fetcher);

  if (!data) return <h1>Loading...</h1>;

  data.details = "This is my details";

  return (
    <Grid container spacing={2} sx={{ pt: 3 }}>
      <Grid item xs={12} sm={6} sx={{ p: 2 }}>
        <StudentProfile data={data} />
      </Grid>
      <Grid item xs={12} sm={6} sx={{ p: 2 }}>
        <StudentProfile data={data} />
      </Grid>
    </Grid>
  );
};

export default withAuth(Student);
