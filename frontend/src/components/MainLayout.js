import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, message } from 'antd';
import { TeamOutlined, LogoutOutlined } from '@ant-design/icons';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const { Header, Content, Sider } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) {
        navigate('/login');
      } else {
        setCurrentUser(user);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      message.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      message.error(`Error logging out: ${error.message}`);
    }
  };

  if (!currentUser) return null;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="logo" style={{ height: '32px', margin: '16px', background: 'rgba(255, 255, 255, 0.3)' }} />
        <Menu theme="dark" mode="inline">
          <Menu.Item 
            key="users" 
            icon={<TeamOutlined />}
            onClick={() => navigate('/')}
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
            {currentUser.email} {process.env.NODE_ENV === 'development' && '(Dev Mode)'}
          </div>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;