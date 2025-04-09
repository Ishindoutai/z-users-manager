import React, { useState } from 'react';
import { Form, Table, Button, Popconfirm, Typography, message } from 'antd';
import EditableCell from './EditableCell';
import { UsersApi } from '../../api/usersApi';

const { Text } = Typography;

const UsersTable = ({ users, loading, onUpdate }) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [saving, setSaving] = useState(false);

  const isEditing = (record) => record.uid === editingKey;

  const edit = (record) => {
    form.setFieldsValue({ 
      permissions: record.permissions || [],
      uid: record.uid
    });
    setEditingKey(record.uid);
  };

  const cancel = () => setEditingKey('');

  const save = async (uid) => {
    try {
      setSaving(true);
      const row = await form.validateFields();
      await UsersApi.update(uid, row.permissions);
      message.success('User updated successfully');
      setEditingKey('');
      onUpdate();
    } catch (error) {
      message.error(error.message || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      editable: true,
      render: (permissions = []) => permissions.join(', '),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      render: (date) => date ? new Date(date).toLocaleString() : '',
    },
    {
      title: 'Actions',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button 
              onClick={() => save(record.uid)} 
              style={{ marginRight: 8 }}
              size="small"
              type="primary"
              loading={saving}
            >
              Save
            </Button>
            <Popconfirm title="Cancel editing?" onConfirm={cancel}>
              <Button size="small" disabled={saving}>Cancel</Button>
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
      onCell: (record) => ({
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