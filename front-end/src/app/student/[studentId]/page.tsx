"use client";

import withAuth from "@/hooks/withAuth";
import { useParams } from "next/navigation";

const StudentProfile = () => {
  const { studentId } = useParams();
  console.log(studentId);
  return <div>Student profile</div>;
};

export default withAuth(StudentProfile);
