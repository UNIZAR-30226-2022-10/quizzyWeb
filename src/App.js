/*
 * Author: - Mathis
 * Filename: - App.js
 * Module: - App
 * Description: - Entry point of the application, contain router and pages of the application.
 */

import * as React from "react"
import { Outlet, Route, BrowserRouter, Routes } from "react-router-dom"

import Solo from "./views/solo"
import Menu from "./views/menu"
import Shop from "./views/shop"
import Collecion from "./views/collecion"
import Stats from "./views/stats"
import Friends from "./views/friends"
import Error404 from "./views/error404"
import Login from "./views/login"
import Register from "./views/register"
import Proposal from "views/proposal"
import Admin from "views/admin"

import Chat from "./components/chat/chat"
import Layout from "components/Layout"

import AuthService from "services/auth"

const App = () => {
    const ProtectedRoute = () => {
        AuthService.verifyToken()
        .then(user => {  
            localStorage.setItem("user",JSON.stringify(user))
        })
        .catch((err) => { 
            console.log(err)
            AuthService.logout()
        })
        return <Outlet/>;
    };

    const AdminRoute = () => {
        AuthService.verifyToken()
        .then(user => {
            if (!user.is_admin) throw new Error("Not an admin");
        })
        .catch((err) => { 
            console.log(err)
            AuthService.logout()
        })
        return <Outlet/>;
    };
    
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Menu />} />
                        <Route path="/solo" element={<Solo />} />
                        <Route path="/chat" element={<Chat />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/collecion" element={<Collecion />} />
                        <Route path="/stats" element={<Stats />} />
                        <Route path="/friends" element={<Friends />} />
                        <Route path="/proposal" element={<Proposal />} />
                        <Route element={<AdminRoute />}>
                            <Route path="/admin" element={<Admin />} />
                        </Route>
                    </Route>
                </Route>

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="*" element={<Error404 />} />
            </Routes>
        </BrowserRouter>
    
    )
}

export default App
