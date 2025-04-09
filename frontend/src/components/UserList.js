import React, { useState, useEffect } from 'react';
import { Table, Tag, Popconfirm, message } from 'antd';
import { fetchUsers, updatePermissions, removeUser } from '../services/usersAPI';
import { auth } from '../firebase';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await fetchUsers();
        setUsers(usersData);
      } catch (error) {
        message.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handlePermissionChange = async (uid, newPermissions) => {
    try {
      await updatePermissions(uid, newPermissions);
      setUsers(users.map(user => 
        user.uid === uid ? { ...user, permissions: newPermissions } : user
      ));
      message.success('Permissions updated successfully');
    } catch (error) {
      message.error('Failed to update permissions');
    }
  };

  const handleDelete = async (uid) => {
    try {
      await removeUser(uid);
      setUsers(users.filter(user => user.uid !== uid));
      message.success('User deleted successfully');
    } catch (error) {
      message.error('Failed to delete user');
    }
  };

  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions, record) => (
        <Select
          mode="multiple"
          value={permissions}
          style={{ width: '100%' }}
          onChange={(value) => handlePermissionChange(record.uid, value)}
          disabled={record.uid === auth.currentUser?.uid}
        >
          <Option value="admin">Admin</Option>
          <Option value="editor">Editor</Option>
          <Option value="viewer">Viewer</Option>
        </Select>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Popconfirm
          title="Are you sure to delete this user?"
          onConfirm={() => handleDelete(record.uid)}
          disabled={record.uid === auth.currentUser?.uid}
        >
          <Button 
            danger 
            disabled={record.uid === auth.currentUser?.uid}
          >
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={users}
      rowKey="uid"
      loading={loading}
      pagination={{ pageSize: 10 }}
    />
  );
};

export default UserList;