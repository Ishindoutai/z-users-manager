import React, { useState } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { UsersApi } from '../../api/usersApi';
import { UserCreateData } from '../../types/user';

const { Option } = Select;

const permissionOptions = [
  'admin',
  'editor',
  'viewer',
  'manager',
  'reports'
];

interface CreateUserFormProps {
  onSuccess: () => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: UserCreateData) => {
    setLoading(true);
    try {
      await UsersApi.create(values);
      message.success('User created successfully');
      form.resetFields();
      onSuccess();
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item
        name="email"
        label="Email"
        rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: true, min: 6, message: 'Password must be at least 6 characters' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label="Confirm Password"
        dependencies={['password']}
        rules={[
          { required: true },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject('The two passwords do not match!');
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="permissions"
        label="Permissions"
        rules={[{ required: true, message: 'Please select at least one permission' }]}
      >
        <Select mode="multiple" placeholder="Select permissions">
          {permissionOptions.map(perm => (
            <Option key={perm} value={perm}>{perm}</Option>
          ))}
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