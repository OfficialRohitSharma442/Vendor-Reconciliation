
import { ConfigProvider, theme } from 'antd';
import Cookies from 'js-cookie';
import React, { useState } from 'react';
import "./App.css";
import { Context } from "./Components/Context/Context";
import Login from './Components/Login/Login';
import Sidebar from './Components/Sidebar/Sidebar';
import LoaderSVG from './Components/utils/Loding';
const App = () => {
  const { defaultAlgorithm, darkAlgorithm } = theme;
  const [role, setRole] = useState<any>("ADMIN");
  const [loading, setloading] = React.useState(true);
  const [token, setToken] = React.useState("");
  const [reload, setReload] = React.useState(false);

  React.useEffect(() => {
    const fetchRole = async () => {

      const storedRole = Cookies.get('VR-user_Role');
      if (storedRole) {
        const parsedData = JSON.parse(storedRole);
        const role = parsedData?.role;
        const token = parsedData?.token;
        setToken(token)
        setRole(role);
        setloading(false)
      } else {
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
          <LoaderSVG />
        </div>
      ) : (
        <ConfigProvider theme={{
          algorithm: false ? darkAlgorithm : defaultAlgorithm,
          token: {
            colorPrimary: '#00b96b',
            borderRadius: 2,
            // colorBgSpotlight: "yellow"
          },

        }}>
          {role ? <Sidebar /> : <Login />}
        </ConfigProvider>
      )}
    </Context.Provider>
  )
}

export default App