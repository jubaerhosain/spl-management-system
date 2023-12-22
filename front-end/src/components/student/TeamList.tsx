import React from "react";
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Avatar } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import useSWR from "swr";
import fetcher from "@/api/fetcher";

const TeamList = () => {
  const { studentId } = useParams();

  const { data } = useSWR(`/student/${studentId}/team`, (url) =>
    fetcher(url, { supervisor: true, spl: true, project: true })
  );

  if (!data) return <p>Loading....</p>;

  console.log(data);

  return (
    <TableContainer component={Paper} style={{ minWidth: 300 }}>
      <Table>
        <TableHead sx={{ backgroundColor: "#dddd" }}>
          <TableRow>
            <TableCell>
              <strong>Team Name</strong>
            </TableCell>
            <TableCell>
              <strong>Team Members</strong>
            </TableCell>
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
            <TableRow key={item.teamId} sx={{ direction: "colum" }}>
              <TableCell>
                <Link style={{ textDecoration: "none", color: "black" }} href={`/team/${item.teamId}`}>
                  {item.teamName}
                </Link>
              </TableCell>
              <TableCell>
                {item.teamMembers.map((member: any) => (
                  <Link
                    key={member.userId}
                    style={{ textDecoration: "none", color: "black", display: "block", padding: "1px" }}
                    href={`/student/${member.userId}`}
                  >
                    {member.name}
                  </Link>
                ))}
              </TableCell>
              <TableCell>
                <Link style={{ textDecoration: "none", color: "black" }} href={`/spl/${item.splId}`}>
                  {item?.spl ? item.spl?.splName.toUpperCase() + ", " + item.spl?.academicYear : ""}
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

export default TeamList;
