import React, { useState, useEffect } from 'react';
import { EditableProTable } from '@ant-design/pro-components';

export default function UserListTable() {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getUserList() {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:5001/z-users-manager/us-central1/getUserList");
      
      if (!response.ok) {
        throw new Error('Erro na requisição');
      }
      
      const data = await response.json();
      
      // Transforma a estrutura dos dados para o formato esperado pela tabela
      const formattedUsers = data.users.map(user => ({
        id: user.id,
        email: user.data.email,
        permissions: user.data.permissions,
        createdAt: user.data.createdAt,
        updatedAt: user.data.updatedAt
      }));
      
      setUserList(formattedUsers);
    } catch (error) {
      console.error('Error fetching user list:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getUserList();
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Permissões',
      dataIndex: 'permissions',
      key: 'permissions',
      valueType: 'tags',
    },
    {
      title: 'Criado em',
      dataIndex: 'createdAt',
      key: 'createdAt',
      valueType: 'date',
    },
    {
      title: 'Atualizado em',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      valueType: 'date',
    },
  ];

  return (
    <EditableProTable
      columns={columns}
      value={userList}
      rowKey="id"
      loading={loading}
      search={false}
      pagination={{
        pageSize: 10,
      }}
    />
  );
}