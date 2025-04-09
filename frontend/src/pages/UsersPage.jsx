import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spin, Space, Typography } from 'antd';
import UsersTable from '../components/UsersTable/UsersTable';
import CreateUserForm from '../components/CreateUserForm/CreateUserForm';
import { UsersApi } from '../api/usersApi';

const { Title } = Typography;

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedUsers = await UsersApi.fetchAll();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}>Z-Users Manager</Title>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card title="Create New User">
            <CreateUserForm onSuccess={getUsers} />
          </Card>
        </Col>
        <Col xs={24} md={16}>
          <Card title="Users List">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '24px' }}>
                <Spin size="large" />
              </div>
            ) : (
              <UsersTable users={users} loading={loading} onUpdate={getUsers} />
            )}
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default UsersPage;