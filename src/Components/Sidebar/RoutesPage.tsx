import React from 'react'
import { Route, Routes } from "react-router-dom"
import Adminmain from "../Admin/adminmain"
import { Context } from '../Context/Context'
import Import from "../Import/Import"
import Reports from '../Reports/Reports'
import Superadmin from '../SuperAdmin/Superadmin'
import Home from '../Home/Home'
import Vendor from '../Vendor/vendor'
const RoutesPage = () => {
    const { role } = React.useContext(Context);
    return (
        <Routes>
            {role == "USER" && <Route path="/*" element={<Home />} ></Route>}
            {role == "USER" && <Route path="/Import" element={<Import />} ></Route>}
            <Route path="/VenderPage" element={<Vendor />} ></Route>
            <Route path="/Reports" element={<Reports />} ></Route>
            {(role == "ADMIN" || role == "MASTER") && <Route path="/Settings" element={<Adminmain />} ></Route>}
            {role == "MASTER" && <Route path="/admin" element={<Superadmin />} ></Route>}
            {/* <Route path="/login" element={<Login />} ></Route> */}
        </Routes>
    )
}

export default RoutesPage