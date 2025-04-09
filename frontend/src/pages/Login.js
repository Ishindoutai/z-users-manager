import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Form, Input, Card, message, Divider, Typography } from 'antd';

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      console.log('Attempting login with:', values.email);
      console.log('Auth emulator config:', process.env.REACT_APP_FIREBASE_AUTH_EMULATOR_HOST);
      
      await signInWithEmailAndPassword(auth, values.email, values.password);
      message.success('Login successful!');
      navigate('/');
    } catch (error) {
      console.error('Full error details:', error);
      let errorMessage = 'Login failed';
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'User not found';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      }
      message.error(errorMessage);
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: '#f0f2f5'
    }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3}>User Management System</Title>
          <Text type="secondary">Please login to continue</Text>
        </div>

        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="Email" 
              size="large" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
              size="large"
            >
              Log in
            </Button>
          </Form.Item>

          {process.env.REACT_APP_USE_EMULATORS === 'true' && (
            <>
              <Divider>Development Access</Divider>
              <div style={{ textAlign: 'center' }}>
                <Text type="secondary">Test accounts:</Text>
                <div style={{ marginTop: 8 }}>
                  <Button 
                    type="link" 
                    onClick={() => onFinish({ email: 'admin@example.com', password: 'password123' })}
                  >
                    admin@example.com
                  </Button>
                </div>
                <div>
                  <Button 
                    type="link" 
                    onClick={() => onFinish({ email: 'user@example.com', password: 'password123' })}
                  >
                    user@example.com
                  </Button>
                </div>
              </div>
            </>
          )}
        </Form>
      </Card>
    </div>
  );
};

export default Login;