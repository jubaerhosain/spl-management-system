import { Outlet } from "react-router-dom";
import PageContainer from "@components/page-container/PageContainer";
import Footer from "@components/footer/Footer";
import MainNavbar from "../main-navbar/MainNavbar";

export default function MainLayout() {
  return (
    <div>
      <PageContainer>
        <MainNavbar />
        <div className="px-1">
          <Outlet />
        </div>
        <Footer />
      </PageContainer>
    </div>
  );
}
