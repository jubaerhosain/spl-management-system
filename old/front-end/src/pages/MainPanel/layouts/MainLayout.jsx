import { Outlet } from "react-router-dom";
import { PageContainer, ContentContainer, Footer } from "@components";
import Navbar from "../navbar/Navbar";

export default function MainLayout() {
  return (
    <div>
      <PageContainer>
        <Navbar />
        <ContentContainer>
          <Outlet />
        </ContentContainer>
        <Footer />
      </PageContainer>
    </div>
  );
}
