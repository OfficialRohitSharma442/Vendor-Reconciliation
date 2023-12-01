import React from 'react'
import { Route, Routes } from "react-router-dom"
import Adminmain from "../Admin/adminmain"
import Vendor from "../Vendor/vendor"
import Import from "../Import/Import"
import Superadmin from '../SuperAdmin/Superadmin'
import Reports from '../Reports/Reports'
import { Context } from '../Context/Context'


const RoutesPage = () => {
    const { role } = React.useContext(Context);

    return (
        <Routes>
            <Route path="/" element={<div>home page</div>} ></Route>
            <Route path="/Import" element={<Import/>} ></Route>
            <Route path="/VenderPage" element={<Vendor />} ></Route>
            <Route path="/Reports" element={<Reports />} ></Route>
            {(role == "ADMIN" || role == "MASTER") && <Route path="/Settings" element={<Adminmain />} ></Route>}
            {role == "MASTER" && <Route path="/admin" element={<Superadmin />} ></Route>}
        </Routes>
    )
}

export default RoutesPage