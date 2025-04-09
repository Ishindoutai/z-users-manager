import { Rule } from 'antd/es/form';

export const validationSchema = {
  email: [
    { required: true, message: 'Please input the email!' },
    { type: 'email' as const, message: 'Please enter a valid email!' },
  ] as Rule[],
  password: [
    { required: true, message: 'Please input the password!' },
    { min: 6, message: 'Password must be at least 6 characters!' },
  ] as Rule[],
  confirmPassword: [
    { required: true, message: 'Please confirm the password!' },
    ({ getFieldValue }: { getFieldValue: (name: string) => any }) => ({
      validator(_: any, value: string) {
        if (!value || getFieldValue('password') === value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('The two passwords do not match!'));
      },
    }),
  ] as Rule[],
  permissions: [
    { required: true, message: 'Please select at least one permission!' },
    {
      validator: (_: any, value: string[]) => {
        if (value && value.length > 0) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('Please select at least one permission!'));
      },
    },
  ] as Rule[],
};