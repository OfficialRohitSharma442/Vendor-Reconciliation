
import Sidebar from './Components/Sidebar/Sidebar'
import { Context } from "./Components/Context/Context"
import React, { useContext, useState } from 'react'
import Login from './Components/Login/Login';
import svgImg from "./assets/loading.svg"
import { Flex } from 'antd';
import LoaderSVG from './Components/utils/Loding';
const App = () => {
  let context = useContext(Context);
  const [role, setRole] = useState<any>("ADMIN");
  const [loading, setloading] = React.useState(true);
  const [token, setToken] = React.useState("");
  const [reload, setReload] = React.useState(false);

  React.useEffect(() => {
    const fetchRole = async () => {
      const storedRole = localStorage.getItem("VR-user_Role");
      if (storedRole) {

        const parsedData = JSON.parse(storedRole);
        const role = parsedData?.role;
        const token = parsedData?.token;
        setToken(token)
        setRole(role);
        setloading(false)

      } else {
        // Handle the case where "VR-user_Role" is not found in localStorage
        // console.error("VR-user_Role not found in localStorage");
        setRole(undefined);
        setloading(false)
      }
    };
    fetchRole();
  }, [reload])

  return (
    <Context.Provider
      value={{
        role,
        setRole,
        token,
        setReload,
        reload
      }}
    >
      {loading ? (
        // Show a loading indicator here if needed
        <div style={{ height: "100vh", width: "100vw", display: "flex", alignItems: 'center', justifyContent: "center" }}>
          {/* <img src={require(svgImg)} /> */}
          <LoaderSVG />
        </div>
      ) : (
        role ? <Sidebar /> : <Login />
      )}
    </Context.Provider>
  )
}

export default App