import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Form, Input, Layout, Typography, message, theme } from 'antd';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

const { Title } = Typography;
const { Content } = Layout;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      message.success('Login realizado com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      message.error('Falha no login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    navigate('/');
    return null;
  }

  return (
    <Layout style={{ minHeight: '100vh', background: colorBgContainer }}>
      <Content
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Card
          title={
            <Title level={3} style={{ textAlign: 'center', marginBottom: 0 }}>
              Z-Users Manager
            </Title>
          }
          style={{ width: 400 }}
        >
          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Por favor insira seu email!' },
                { type: 'email', message: 'Email inválido!' },
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
              rules={[
                { required: true, message: 'Por favor insira sua senha!' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Senha"
                size="large"
              />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Lembrar-me</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
              >
                Entrar
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

export default LoginPage;