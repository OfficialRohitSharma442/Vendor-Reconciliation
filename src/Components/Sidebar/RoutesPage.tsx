import React from 'react'
import { Route, Routes } from "react-router-dom"
import Adminmain from "../Admin/adminmain"
import Vendor from "../Vendor/vendor"
import Reports from "../Reports/Reports"
import Login from "../Login/Login"
import { Context } from "../Context/Context"
import Superadmin from '../SuperAdmin/Superadmin'



const RoutesPage = () => {
    const { role } = React.useContext(Context);

    return (
        <Routes>
            <Route path="/" element={<>Home Page</>} ></Route>
            <Route path="/Import" element={<div>Import page</div>} ></Route>
            <Route path="/VenderPage" element={<Vendor />} ></Route>
            <Route path="/Reports" element={<Reports />} ></Route>
            {(role == "ADMIN" || role == "MASTER") && <Route path="/Settings" element={<Adminmain />} ></Route>}
            {role == "MASTER" && <Route path="/admin" element={<Superadmin />} ></Route>}
        </Routes>
    )
}

export default RoutesPage