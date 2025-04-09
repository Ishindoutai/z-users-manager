import React, { useState } from 'react';
import { Form, Table, Button, Popconfirm, Typography, message } from 'antd';
import { User } from '../../types/user';
import EditableCell from './EditableCell';
import { UsersApi } from '../../api/usersApi';

const { Text } = Typography;

interface UsersTableProps {
  users: User[];
  loading: boolean;
  onUpdate: () => void;
}

const UsersTable: React.FC<UsersTableProps> = ({ users, loading, onUpdate }) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record: User) => record.uid === editingKey;

  const edit = (record: User) => {
    form.setFieldsValue({ 
      permissions: record.permissions || [], // Apenas as permissões
      uid: record.uid // Mantemos o uid para referência
    });
    setEditingKey(record.uid);
  };

  const cancel = () => setEditingKey('');

  const save = async (uid: string) => {
    try {
      const row = await form.validateFields();
      await UsersApi.update(uid, row.permissions);
      message.success('User updated successfully');
      setEditingKey('');
      onUpdate();
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to update user');
    }
  };

  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      editable: true,
      render: (permissions: string[] = []) => permissions.join(', '),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      render: (date: string) => date ? new Date(date).toLocaleString() : '',
    },
    {
      title: 'Actions',
      render: (_: any, record: User) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button 
              onClick={() => save(record.uid)} 
              style={{ marginRight: 8 }}
              size="small"
              type="primary"
            >
              Save
            </Button>
            <Popconfirm title="Cancel editing?" onConfirm={cancel}>
              <Button size="small">Cancel</Button>
            </Popconfirm>
          </span>
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
    if (!col.editable) return col;
    
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
    <Form form={form} component={false}>
      <Table
        components={{ body: { cell: EditableCell } }}
        bordered
        dataSource={users}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{ pageSize: 10 }}
        loading={loading}
        rowKey="uid"
        scroll={{ x: true }}
      />
    </Form>
  );
};

export default UsersTable;