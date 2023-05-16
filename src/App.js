import "alertifyjs/build/css/alertify.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import WelcomePage from "./pages/welcomePage/WelcomePage";
import Temp from "./Components/Temp";
import User from "./pages/users/User";
import Team from "./pages/team/Team";
import PrivateRoute from "./routers/PrivateRoute";
import AssessmentPage from "./pages/assessmentPage/AssessmentPage";
import Report from "./pages/report/Report";
import LoginRoute from "./routers/LoginRoute";
import Header from "./Components/Header";
import Stages from "./pages/stages/Stages";
import Project from "./pages/project/Project";
import ProjectInterns from "./pages/projectInterns/ProjectInterns";
function App() {
    return (
        <div>
            <Header />
            <Routes>
                <Route path="/" />
                {/* <PrivateRoute path="/main" element={HomePage} /> */}
                <Route path="/user/:userId" element={<User />} />
                <Route path="project/:projectId" element={<Project />} />
                <Route
                    path="projectInerns/:projectId"
                    element={<ProjectInterns />}
                />
                <Route path="/team/:teamId" element={<Team />} />
                <Route path="/login" element={<WelcomePage />} />
                <Route path="/stages/:teamId" element={<Stages />} />
                <Route path="/form/:teamId" element={<AssessmentPage />} />
                <Route path="/report/:userId/:teamId" element={<Report />} />
            </Routes>
        </div>
    );
}

export default App;
