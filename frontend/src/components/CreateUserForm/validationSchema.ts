import * as yup from 'yup';

export const validationSchema = {
  email: [
    { required: true, message: 'Please input the email!' },
    { type: 'email', message: 'Please enter a valid email!' },
  ],
  password: [
    { required: true, message: 'Please input the password!' },
    { min: 6, message: 'Password must be at least 6 characters!' },
  ],
  confirmPassword: [
    { required: true, message: 'Please confirm the password!' },
    ({ getFieldValue }: any) => ({
      validator(_: any, value: string) {
        if (!value || getFieldValue('password') === value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('The two passwords do not match!'));
      },
    }),
  ],
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
  ],
};

export const yupSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
  permissions: yup.array().min(1, 'Select at least one permission').required('Permissions are required'),
});