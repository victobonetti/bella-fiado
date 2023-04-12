import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import App from './App'
import { HelloPage } from "./UserPages/HelloPage";
import { AdminLogin } from "./AdminPages/AdminLogin";
import { AdminPannel } from "./AdminPages/AdminPannel";
import { UsersPage } from "./AdminPages/UsersPage";
import { AccountsPage } from "./AdminPages/AccountsPage/AccountsPage";
import { ProductsPage } from "./AdminPages/ProductsPage";
import { EditHeader } from "./AdminPages/AdminPages_components/Header/Header/EditHeader";

export function AppRouter() {

    return (
        
            <Router>
                <Routes >
                    <Route path="/" element={<App />} />
                    <Route path="/inicio" element={<HelloPage />} />
                    <Route path="/admin" element={<AdminLogin />} />
                    <Route path="/admin/pannel" >
                        <Route index element={<AdminPannel />} />
                        <Route element={<EditHeader />}>
                            <Route path="/admin/pannel/users" element={<UsersPage />} />
                            <Route path="/admin/pannel/accounts" element={<AccountsPage />} />
                            <Route path="/admin/pannel/products" element={<ProductsPage />} />
                        </Route>
                    </Route>
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>

    )
}