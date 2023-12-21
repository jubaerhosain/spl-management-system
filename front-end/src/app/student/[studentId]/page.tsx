"use client";

import fetcher from "@/api/fetcher";
import withAuth from "@/hooks/withAuth";
import { useParams } from "next/navigation";
import useSWR from "swr";
import StudentProfileCard from "@/components/student/StudentProfileCard";
import ProfileInfoTab from "@/components/student/ProfileInfoTab";
import { Grid } from "@mui/material";

const Student = () => {
  const { studentId } = useParams();
  const { data, isLoading } = useSWR(`/student/${studentId}`, fetcher);

  if (!data || isLoading) return <h1>Loading...</h1>;

  data.details = "This is my details";

  return (
    <Grid container spacing={2} sx={{ margin: "auto", pt: 2 }}>
      <Grid item sm={12} md={6} sx={{ p: 2 }}>
        <StudentProfileCard data={data} />
      </Grid>
      <Grid item sm={12} md={6} sx={{ p: 2 }}>
        <StudentProfileCard data={data} />
      </Grid>
      <Grid item sm={12} md={12} sx={{ pl: 4, pr: 2, mt: 3 }}>
        <ProfileInfoTab />
      </Grid>
    </Grid>
  );
};

export default withAuth(Student);
