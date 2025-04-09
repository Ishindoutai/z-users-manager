import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spin, Space, Typography } from 'antd';
import UsersTable from '../components/UsersTable/UsersTable';
import CreateUserForm from '../components/CreateUserForm/CreateUserForm';
import { fetchUsers } from '../api/usersApi';

const { Title } = Typography;

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUsers = async () => {
    setLoading(true);
    try {
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
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
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card title="Create New User">
            <CreateUserForm onSuccess={getUsers} />
          </Card>
        </Col>
        <Col xs={24} md={16}>
          <Card title="Users List">
            {loading ? (
              <Spin size="large" />
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