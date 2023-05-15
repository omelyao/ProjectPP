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
import Footer from "./Components/Footer";
function App() {
    return (
        <div>
            <Header />
            <Routes>
                <Route path="/" />
                {/* <PrivateRoute path="/main" element={HomePage} /> */}
                <Route path="/user/:userId" element={<User />} />
                <Route path="/team/:teamId" element={<Team />} />
                <Route path="/login" element={<WelcomePage />} />
                <Route path="/form/:teamId" element={<AssessmentPage />} />
                <Route path="/report/:teamId/:userId" element={<Report />} />
            </Routes>
            <Footer />
        </div>
    );
}

export default App;
