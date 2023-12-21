import React from "react";
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Avatar } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import useSWR from "swr";
import fetcher from "@/api/fetcher";

const SplList = () => {
  const { studentId } = useParams();
  console.log(`student/${studentId}/spl`);

  const { data } = useSWR(`/student/${studentId}/spl`, (url) => fetcher(url, { supervisor: true }));

  if (!data) return <p>Loading....</p>;

  console.log(data);

  return (
    <TableContainer component={Paper} style={{ minWidth: 300 }}>
      <Table>
        <TableHead sx={{ backgroundColor: "#dddd" }}>
          <TableRow>
            <TableCell>SPL</TableCell>
            <TableCell>Supervisor</TableCell>
            <TableCell>Project</TableCell>
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
              <TableCell sx={{ display: "flex", flex: "colum", alignItems: "center" }}>
                <Avatar sx={{ mr: 1 }}>
                  <Image
                    alt={item.supervisor?.name}
                    src={item.supervisor?.avatar || "/logo.png"}
                    width={20}
                    height={20}
                  />
                </Avatar>
                <Link style={{ textDecoration: "none", color: "black" }} href={`/teacher/${item.supervisor?.userId}`}>
                  {item.supervisor?.name}
                </Link>
              </TableCell>
              <TableCell>{item.project?.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SplList;
