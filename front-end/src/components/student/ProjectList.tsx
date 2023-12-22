import React from "react";
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Avatar } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import useSWR from "swr";
import fetcher from "@/api/fetcher";

const TeamList = () => {
  const { studentId } = useParams();

  const { data, error } = useSWR(`/student/${studentId}/project`, (url) =>
    fetcher(url, { supervisor: true, spl: true })
  );

  if(error) return <p>An error occurred</p>

  console.log(error);

  if (!data) return <p>Loading....</p>;

  console.log(data);

  return (
    <TableContainer component={Paper} style={{ minWidth: 300 }}>
      <Table>
        <TableHead sx={{ backgroundColor: "#dddd" }}>
          <TableRow>
            <TableCell>
              <strong>Project Name</strong>
            </TableCell>
            <TableCell>
              <strong>Project Contributors</strong>
            </TableCell>
            <TableCell>
              <strong>SPL</strong>
            </TableCell>
            <TableCell>
              <strong>Supervisor</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item: any) => (
            <TableRow key={item.teamId} sx={{ direction: "colum" }}>
              <TableCell>
                <Link style={{ textDecoration: "none", color: "black" }} href={`/project/${item.project?.projectId}`}>
                  {item.projectName}
                </Link>
              </TableCell>
              <TableCell>
                {item.projectContributors?.map((member: any) => (
                  <Link
                    key={member.userId}
                    style={{
                      textDecoration: "none",
                      color: "black",
                      display: "block",
                      lineHeight: "30px"
                    }}
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TeamList;
