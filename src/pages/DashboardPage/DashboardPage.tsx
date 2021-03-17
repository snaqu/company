import React from "react";
import ResumeList from "./components/ResumeList/ResumeList";
import WorkspacesSlider from "./components/WorkspacesSlider/WorkspacesSlider";
import "./DashboardPage.css";

interface Props {}

const DashboardPage = (props: Props) => {
  return (
    <div className="dashboardWrapper">
      <WorkspacesSlider />
      <ResumeList />
    </div>
  );
};

export default DashboardPage;
