// frontend/src/pages/UsersManager.js
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import { getUsers, createUser, updateUser } from './services/api';

const { Option } = Select;

const UsersManager = () => {
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      message.error('Falha ao carregar usuários');
    }
  };

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      await createUser(values);
      message.success('Usuário criado com sucesso');
      setIsModalVisible(false);
      form.resetFields();
      fetchUsers();
    } catch (error) {
      message.error('Erro ao criar usuário');
    }
  };

  const handleUpdate = async (uid, field, value) => {
    try {
      await updateUser(uid, { [field]: value });
      message.success('Usuário atualizado com sucesso');
      fetchUsers();
    } catch (error) {
      message.error('Erro ao atualizar usuário');
    }
  };

  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Permissão',
      dataIndex: 'role',
      key: 'role',
      render: (text, record) => (
        <Select
          defaultValue={text}
          style={{ width: 120 }}
          onChange={(value) => handleUpdate(record.uid, 'role', value)}
        >
          <Option value="admin">Admin</Option>
          <Option value="editor">Editor</Option>
          <Option value="user">Usuário</Option>
        </Select>
      ),
    },
  ];

  return (
    <div>
      <Button 
        type="primary" 
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: 16 }}
      >
        Criar Usuário
      </Button>

      <Table 
        columns={columns} 
        dataSource={users} 
        rowKey="uid" 
      />

      <Modal
        title="Criar Novo Usuário"
        visible={isModalVisible}
        onOk={handleCreate}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Por favor insira o email' },
              { type: 'email', message: 'Email inválido' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Senha"
            rules={[
              { required: true, message: 'Por favor insira a senha' },
              { min: 6, message: 'A senha deve ter pelo menos 6 caracteres' }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="role"
            label="Permissão"
            initialValue="user"
          >
            <Select>
              <Option value="admin">Admin</Option>
              <Option value="editor">Editor</Option>
              <Option value="user">Usuário</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UsersManager;