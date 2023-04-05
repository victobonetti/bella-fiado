import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from './App'
import { HelloPage } from "./UserPages/HelloPage";

export function AppRouter(){
    return(
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/inicio" element={<HelloPage />} />
            </Routes>
        </Router>
    )
}