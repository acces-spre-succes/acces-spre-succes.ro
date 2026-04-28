import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Volunteers from "./Volunteers";
import UpcomingProjects from "./UpcomingProjects";
import CompletedProjects from "./CompletedProjects";
import Articles from "./Articles";

export default function AdminPanel() {
    const [activeSection, setActiveSection] = useState("volunteers");

    return (
        <div className="admin-container" style={{ display: "flex" }}>
            <Sidebar active={activeSection} onSelect={setActiveSection} />

            <div className="main-content" style={{ flex: 1, padding: "20px" }}>
                {activeSection === "volunteers" && <Volunteers />}
                {activeSection === "articles" && <Articles />}
                {activeSection === "upcomingProjects" && <UpcomingProjects />}
                {activeSection === "completedProjects" && <CompletedProjects />}
            </div>
        </div>
    );
}
