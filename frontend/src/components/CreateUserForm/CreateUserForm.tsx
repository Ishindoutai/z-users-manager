import React from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import type { Rule } from 'antd/es/form';
import { UserCreateData } from '../../types/user';
import { createUser } from '../../api/usersApi';
import { validationSchema } from './validationSchema';

const { Option } = Select;

interface CreateUserFormProps {
  onSuccess: () => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values: UserCreateData) => {
    setLoading(true);
    try {
      await createUser(values);
      message.success('User created successfully');
      form.resetFields();
      onSuccess();
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      name="createUser"
      onFinish={onFinish}
      layout="vertical"
      scrollToFirstError
      autoComplete="off"
    >
      <Form.Item
        name="email"
        label="Email"
        rules={validationSchema.email}
      >
        <Input placeholder="user@example.com" />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={validationSchema.password}
      >
        <Input.Password placeholder="At least 6 characters" />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label="Confirm Password"
        dependencies={['password']}
        rules={validationSchema.confirmPassword}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="permissions"
        label="Permissions"
        rules={validationSchema.permissions}
      >
        <Select mode="multiple" placeholder="Select permissions">
          <Option value="admin">Admin</Option>
          <Option value="editor">Editor</Option>
          <Option value="viewer">Viewer</Option>
          <Option value="manager">Manager</Option>
          <Option value="reports">Reports</Option>
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

export default CreateUserForm;