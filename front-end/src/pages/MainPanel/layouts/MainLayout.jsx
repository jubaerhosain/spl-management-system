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
          <h1 className="z-10 hover:z-50 hover:text-red-500 relative">Diving</h1>
        </div>
        <Footer />
      </PageContainer>
    </div>
  );
}
