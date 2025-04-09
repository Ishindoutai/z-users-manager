import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, message } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import './App.css';

const { Header, Content, Sider } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('users');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      message.success('Logged out successfully');
    } catch (error) {
      message.error('Error logging out');
    }
  };

  if (!currentUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Button type="primary" onClick={() => window.location.href = '/login'}>
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="logo" style={{ height: '32px', margin: '16px', background: 'rgba(255, 255, 255, 0.3)' }} />
        <Menu theme="dark" selectedKeys={[activeMenu]} mode="inline">
          <Menu.Item 
            key="users" 
            icon={<TeamOutlined />}
            onClick={() => setActiveMenu('users')}
          >
            User Management
          </Menu.Item>
          <Menu.Item 
            key="logout" 
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          <div style={{ float: 'right', marginRight: '20px', color: 'white' }}>
            {currentUser.email}
          </div>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            {activeMenu === 'users' && (
              <>
                <h2>User Management</h2>
                <UserForm />
                <UserList />
              </>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;