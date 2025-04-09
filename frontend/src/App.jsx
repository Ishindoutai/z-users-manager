import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import MainLayout from './components/Layout';
import UsersPage from './pages/Users';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#00b96b',
        },
      }}
    >
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={<MainLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="users" element={<UsersPage />} />
          </Route>
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;