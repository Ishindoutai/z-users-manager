import React, { useState } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { createNewUser } from '../services/usersAPI';

const { Option } = Select;

const UserForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await createNewUser(values);
      message.success('User created successfully');
      form.resetFields();
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      name="create_user"
      layout="inline"
      onFinish={onFinish}
      style={{ marginBottom: '20px' }}
    >
      <Form.Item
        name="email"
        rules={[
          { required: true, message: 'Please input email!' },
          { type: 'email', message: 'Please enter a valid email!' }
        ]}
      >
        <Input placeholder="Email" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          { required: true, message: 'Please input password!' },
          { min: 6, message: 'Password must be at least 6 characters!' }
        ]}
      >
        <Input.Password placeholder="Password" />
      </Form.Item>

      <Form.Item
        name="permissions"
        rules={[{ required: true, message: 'Please select permissions!' }]}
      >
        <Select mode="multiple" placeholder="Select permissions" style={{ width: 200 }}>
          <Option value="admin">Admin</Option>
          <Option value="editor">Editor</Option>
          <Option value="viewer">Viewer</Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Create User
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UserForm;