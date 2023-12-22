import React from "react";
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Avatar } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import useSWR from "swr";
import fetcher from "@/api/fetcher";

const SplList = () => {
  const { studentId } = useParams();

  const { data, error } = useSWR(`/student/${studentId}/spl`, (url) =>
    fetcher(url, { supervisor: true, project: true })
  );

  if (error) return <p>An error occurred</p>;

  if (!data) return <p>Loading....</p>;

  console.log(data);

  return (
    <TableContainer component={Paper} style={{ minWidth: 300 }}>
      <Table>
        <TableHead sx={{ backgroundColor: "#dddd" }}>
          <TableRow>
            <TableCell>
              <strong>SPL</strong>
            </TableCell>
            <TableCell>
              <strong>Supervisor</strong>
            </TableCell>
            <TableCell>
              <strong>Project</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item: any) => (
            <TableRow key={item.splId}>
              <TableCell>
                <Link style={{ textDecoration: "none", color: "black" }} href={`/spl/${item.splId}`}>
                  {item.splName.toUpperCase() + ", " + item.academicYear}
                </Link>
              </TableCell>
              <TableCell>
                <Link style={{ textDecoration: "none", color: "black" }} href={`/teacher/${item.supervisor?.userId}`}>
                  {item.supervisor?.name}
                </Link>
              </TableCell>
              <TableCell>
                <Link style={{ textDecoration: "none", color: "black" }} href={`/project/${item.project?.projectId}`}>
                  {item.project?.projectName}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SplList;
