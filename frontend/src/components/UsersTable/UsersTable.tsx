import React, { useState } from 'react';
import { Table, Button, Popconfirm, Typography, message } from 'antd';
import { User } from '../../types/user';
import EditableCell from './EditableCell';
import { updateUser } from '../../api/usersApi';

const { Text } = Typography;

interface UsersTableProps {
  users: User[];
  loading: boolean;
  onUpdate: () => void;
}

const UsersTable: React.FC<UsersTableProps> = ({ users, loading, onUpdate }) => {
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record: User) => record.uid === editingKey;

  const edit = (record: User) => {
    setEditingKey(record.uid);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (uid: string, updatedPermissions: string[]) => {
    try {
      await updateUser(uid, updatedPermissions);
      message.success('User updated successfully');
      setEditingKey('');
      onUpdate();
    } catch (err: unknown) {
      message.error('Error updating user');
      console.error('Error updating user:', err);
    }
  };

  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      editable: true,
      render: (permissions: string[] = []) => permissions.join(', '),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => date ? new Date(date).toLocaleString() : '',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (_: unknown, record: User) => {
        const editable = isEditing(record);
        return editable ? (
          <>
            <Button
              onClick={() => save(record.uid, record.permissions || [])}
              style={{ marginRight: 8 }}
              size="small"
              type="primary"
            >
              Save
            </Button>
            <Popconfirm title="Cancel editing?" onConfirm={cancel}>
              <Button size="small">Cancel</Button>
            </Popconfirm>
          </>
        ) : (
          <Button 
            disabled={editingKey !== ''} 
            onClick={() => edit(record)} 
            size="small"
          >
            Edit
          </Button>
        );
      },
    },
  ];

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: User) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Table
      components={{
        body: {
          cell: EditableCell,
        },
      }}
      bordered
      dataSource={users}
      columns={mergedColumns}
      rowClassName="editable-row"
      pagination={{ pageSize: 10 }}
      loading={loading}
      rowKey="uid"
      scroll={{ x: true }}
    />
  );
};

export default UsersTable;