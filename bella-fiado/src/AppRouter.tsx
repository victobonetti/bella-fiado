import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from './App'
import { HelloPage } from "./UserPages/HelloPage";
import { AdminLogin } from "./AdminPages/AdminLogin";
import { AdminPannel } from "./AdminPages/AdminPannel";
import { UsersPage } from "./AdminPages/UsersPage";
import { AccountsPage } from "./AdminPages/AccountsPage";
import { ProductsPage } from "./AdminPages/ProductsPage";

export function AppRouter(){
    return(
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/inicio" element={<HelloPage />} />
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin/pannel/" element={<AdminPannel />} />
                <Route path="/admin/pannel/users" element={<UsersPage />} />
                <Route path="/admin/pannel/accounts" element={<AccountsPage />} />
                <Route path="/admin/pannel/products" element={<ProductsPage />} />
            </Routes>
        </Router>
    )
}