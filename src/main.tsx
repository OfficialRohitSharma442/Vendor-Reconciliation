
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <ConfigProvider theme={{
    token: {
      colorPrimary: '#00b96b',
      borderRadius: 2,
      colorBgSpotlight: "red"
    },
  }}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ConfigProvider>
)
