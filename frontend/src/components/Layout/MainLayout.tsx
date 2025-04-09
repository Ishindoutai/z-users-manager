import React from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // Menu items configuration
  const menuItems = [
    {
      key: '1',
      label: <Link to="/">Users Manager</Link>,
    }
  ];

  // Breadcrumb items configuration
  const breadcrumbItems = [
    { title: 'Home' },
    { title: 'Users' },
  ];

  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu 
          theme="dark" 
          mode="horizontal" 
          defaultSelectedKeys={['1']}
          items={menuItems}
        />
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <Breadcrumb 
          style={{ margin: '16px 0' }}
          items={breadcrumbItems}
        />
        <div className="site-layout-content">
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Z-Users Manager ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};

export default MainLayout;