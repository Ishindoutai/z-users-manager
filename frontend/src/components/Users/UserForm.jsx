import { Modal, Form, Input, Select, Button, message } from 'antd';
import { useEffect } from 'react';

const { Option } = Select;

const UserForm = ({ visible, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const onFinish = (values) => {
    onSubmit(values);
  };

  return (
    <Modal
      title={initialValues ? 'Edit User' : 'Create User'}
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          permissions: ['read'],
        }}
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please input the email!' },
            { type: 'email', message: 'Please enter a valid email!' },
          ]}
        >
          <Input />
        </Form.Item>

        {!initialValues && (
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please input the password!' },
              { min: 6, message: 'Password must be at least 6 characters!' },
            ]}
          >
            <Input.Password />
          </Form.Item>
        )}

        <Form.Item
          name="permissions"
          label="Permissions"
          rules={[{ required: true, message: 'Please select permissions!' }]}
        >
          <Select mode="multiple" placeholder="Select permissions">
            <Option value="read">Read</Option>
            <Option value="write">Write</Option>
            <Option value="admin">Admin</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserForm;