import { Route, Routes } from "react-router-dom"
import Adminmain from "../Admin/adminmain"
import Vendor from "../Vendor/vendor"
import Reports from "../Reports/Reports"


const RoutesPage = () => {
    return (
        <Routes>
            <Route path="/" element={<div>home page</div>} ></Route>
            <Route path="/Import" element={<div>Import page</div>} ></Route>
            <Route path="/VenderPage" element={<Vendor />} ></Route>
            <Route path="/Reports" element={<Reports />} ></Route>
            <Route path="/Settings" element={<Adminmain />} ></Route>
            <Route path="/admin" element={<div>Super  Admin page</div>} ></Route>
        </Routes>
    )
}

export default RoutesPage