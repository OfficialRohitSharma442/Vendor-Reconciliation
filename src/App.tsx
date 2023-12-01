
import Sidebar from './Components/Sidebar/Sidebar'
import { Context } from "./Components/Context/Context"
import React, { useContext, useState } from 'react'
import Login from './Components/Login/Login';
import { Flex } from 'antd';

const App = () => {
  let context = useContext(Context);
  const [role, setRole] = useState<any>("ADMIN");
  const [loading, setloading] = React.useState(true);
  const [Token, setToken] = React.useState("");

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
  }, [])

  return (
    <Context.Provider
      value={{
        role,
        setRole,
        Token
      }}
    >
      {loading ? (
        // Show a loading indicator here if needed
        <div style={{ height: "100vh", width: "100vw", display: "flex", alignItems: 'center', justifyContent: "center" }}>
          <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns: xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            width="80px" height="80px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml: space="preserve">
            <path opacity="0.2" fill="#000" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
        s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
        c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"/>
            <path fill="#000" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
        C22.32,8.481,24.301,9.057,26.013,10.047z">
              <animateTransform attributeType="xml"
                attributeName="transform"
                type="rotate"
                from="0 20 20"
                to="360 20 20"
                dur="0.9s"
                repeatCount="indefinite" />
            </path>
          </svg>
        </div>
      ) : (
        role ? <Sidebar /> : <Login />
      )}
    </Context.Provider>
  )
}

export default App