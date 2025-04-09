import { Layout, Menu, theme, Avatar, Dropdown, Space, Typography } from 'antd';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react'; // Add this import

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

const MainLayout = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Move the navigation logic to useEffect
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const items = [
    {
      key: '1',
      label: <Link to="/">Dashboard</Link>,
      icon: <UserOutlined />,
    },
    {
      key: '2',
      label: <Link to="/users">Usuários</Link>,
      icon: <UserOutlined />,
    },
  ];

  const userMenuItems = [
    {
      key: '1',
      label: 'Perfil',
      icon: <UserOutlined />,
    },
    {
      key: '2',
      label: 'Sair',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return null; // The navigation will be handled by useEffect
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="light">
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Text strong style={{ color: '#00b96b' }}>Z-Users Manager</Text>
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          style={{ height: '100%', borderRight: 0 }}
          items={items}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} />
              <Text>{user.email}</Text>
            </Space>
          </Dropdown>
        </Header>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;