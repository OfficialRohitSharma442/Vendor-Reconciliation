
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
ReactDOM.createRoot(document.getElementById('root')!).render(
  // <ConfigProvider theme={{
  //   token: {
  //     colorBgLayout: "rgba(0, 0, 0, 0.02)"
  //   }
  // }}>


  <BrowserRouter>
    <App />
  </BrowserRouter>
  // </ConfigProvider>
)
