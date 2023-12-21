// import { Tabs, Tab, Container } from "@mui/material";
// import { useState } from "react";

// const ProfileInfoTab = () => {
//   const [value, setValue] = useState(0);

//   const handleChange = (e: any, newValue: number) => {
//     setValue(newValue);
//   };

//   return (
//     <Container>
//       <Tabs value={value} onChange={handleChange} centered>
//         <Tab label="Tab 1" />
//         <Tab label="Tab 2" />
//         <Tab label="Tab 3" />
//       </Tabs>

//       {/* Content for Tab 1 */}
//       {value === 0 && <div>Content for Tab 1</div>}

//       {/* Content for Tab 2 */}
//       {value === 1 && <div>Content for Tab 2</div>}

//       {/* Content for Tab 3 */}
//       {value === 2 && <div>Content for Tab 3</div>}
//     </Container>
//   );
// };

// export default ProfileInfoTab;

import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

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
        <Box sx={{ p: 3 }}>
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
    <Box maxWidth="xs">
      <Box maxWidth="xs" sx={{ borderBottom: 1, borderColor: "divider", backgroundColor: "white" }}>
        <Tabs
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
      <CustomTabPanel value={value} index={0}>
        Item One
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Item Two
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Item Three
      </CustomTabPanel>
    </Box>
  );
}
