import { Card, Col, Row, Statistic, Typography } from 'antd';
import { UserOutlined, LockOutlined, TeamOutlined } from '@ant-design/icons';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { useEffect, useState } from 'react';
import { getUsersCount } from '../services/api';

const { Title } = Typography;

const DashboardPage = () => {
  const [user] = useAuthState(auth);
  const [stats, setStats] = useState({
    usersCount: 0,
    activeUsers: 0,
    adminsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const count = await getUsersCount();
        setStats({
          usersCount: count.total,
          activeUsers: count.active,
          adminsCount: count.admins,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>
        Dashboard
      </Title>
      <Title level={4} style={{ marginBottom: 24 }}>
        Bem-vindo, {user?.email}
      </Title>

      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total de Usuários"
              value={stats.usersCount}
              prefix={<TeamOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Usuários Ativos"
              value={stats.activeUsers}
              prefix={<UserOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Administradores"
              value={stats.adminsCount}
              prefix={<LockOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="Atividades Recentes" style={{ marginTop: 16 }}>
            <p>Últimos usuários criados</p>
            <p>Atividades do sistema</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;