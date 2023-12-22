import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import SplList from "./SplList";
import TeamList from "./TeamList";
import ProjectList from "./ProjectList";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", margin: "auto" }}>
      <Box
        sx={{
          margin: "auto",
          width: "100%",
          xs: { width: "100%" },
          boxShadow: "0px 1px grey",
          borderBottom: 1,
          borderColor: "divider",
          backgroundColor: "white",
        }}
      >
        <Tabs
          sx={{ width: "100%" }}
          value={value}
          variant="scrollable"
          scrollButtons="auto"
          onChange={handleChange}
          aria-label="scrollable auto tabs"
        >
          <Tab sx={{ color: "black" }} label="SPLs" {...a11yProps(0)} />
          <Tab sx={{ color: "black" }} label="Teams" {...a11yProps(1)} />
          <Tab sx={{ color: "black" }} label="Projects" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <Box minHeight={300} mt={1}>
        <CustomTabPanel value={value} index={0}>
          <SplList />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <TeamList/>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <ProjectList />
        </CustomTabPanel>
      </Box>
    </Box>
  );
}
