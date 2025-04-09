import React, { useState } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { UsersApi } from '../../api/usersApi';

const { Option } = Select;

const permissionOptions = [
  { value: 'admin', label: 'Administrator' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
  { value: 'manager', label: 'Manager' },
];

const CreateUserForm = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      await UsersApi.create(values);
      message.success('User created successfully');
      form.resetFields();
      onSuccess();
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Creation failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form 
      form={form} 
      onFinish={onFinish} 
      layout="vertical"
      autoComplete="off"
    >
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Please input email' },
          { type: 'email', message: 'Invalid email' }
        ]}
      >
        <Input placeholder="user@example.com" />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          { required: true },
          { min: 6, message: 'Minimum 6 characters' }
        ]}
      >
        <Input.Password placeholder="••••••" />
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
              return Promise.reject('Passwords do not match');
            },
          }),
        ]}
      >
        <Input.Password placeholder="••••••" />
      </Form.Item>

      <Form.Item
        name="permissions"
        label="Permissions"
        rules={[{ required: true, message: 'Select at least one permission' }]}
      >
        <Select
          mode="multiple"
          placeholder="Select permissions"
          options={permissionOptions}
        />
      </Form.Item>

      <Form.Item>
        <Button 
          type="primary" 
          htmlType="submit" 
          loading={submitting}
          block
        >
          Create User
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateUserForm;