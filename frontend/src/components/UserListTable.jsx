
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Checkbox, Tag, Popconfirm, App } from 'antd';

const { useApp } = App;
const CheckboxGroup = Checkbox.Group;

const AVAILABLE_PERMISSIONS = ['admin', 'editor', 'viewer', 'manager', 'reporter'];

const CreateUserModal = ({ visible, onCancel, onCreate, loading, form }) => (
  <Modal
    title="Adicionar Novo Usuário"
    open={visible}
    onOk={onCreate}
    onCancel={onCancel}
    confirmLoading={loading}
    okText="Criar"
    cancelText="Cancelar"
  >
    <Form form={form} layout="vertical">
      <Form.Item name="email" label="Email" rules={[
        { required: true, message: 'Por favor, insira o email' },
        { type: 'email', message: 'Por favor, insira um email válido' }
      ]}>
        <Input placeholder="exemplo@email.com" />
      </Form.Item>
      <Form.Item name="password" label="Senha" rules={[
        { required: true, message: 'Por favor, insira a senha' },
        { min: 6, message: 'A senha deve ter pelo menos 6 caracteres' }
      ]}>
        <Input.Password placeholder="Digite a senha" />
      </Form.Item>
      <Form.Item name="permissions" label="Permissões">
        <CheckboxGroup options={AVAILABLE_PERMISSIONS} />
      </Form.Item>
    </Form>
  </Modal>
);

export default function UserListTable() {
  const { message } = useApp();
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const api = {
    createUser: async (userData) => {
      const res = await fetch("http://127.0.0.1:5001/z-users-manager/us-central1/createUser", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Erro ao criar usuário');
      return res.json();
    },
    getUserById: async (userId) => {
      const res = await fetch(`http://127.0.0.1:5001/z-users-manager/us-central1/getUserById?userId=${userId}`);
      if (!res.ok) throw new Error((await res.json()).message || 'Erro ao buscar usuário');
      const data = await res.json();
      return {
        id: data.user.id,
        email: data.user.email,
        permissions: data.user.permissions || [],
        createdAt: data.user.createdAt,
        updatedAt: data.user.updatedAt || data.user.createdAt
      };
    },
    getUserList: async () => {
      const res = await fetch("http://127.0.0.1:5001/z-users-manager/us-central1/getUserList");
      if (!res.ok) throw new Error((await res.json()).message || 'Erro ao buscar usuários');
      const data = await res.json();
      return data.users.map(user => ({
        id: user.id,
        email: user.data.email,
        permissions: user.data.permissions || [],
        createdAt: user.data.createdAt,
        updatedAt: user.data.updatedAt || user.data.createdAt
      }));
    },
    updateUser: async (userId, data) => {
      const res = await fetch(`http://127.0.0.1:5001/z-users-manager/us-central1/updateUserById?userId=${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Erro ao atualizar usuário');
    },
    deleteUserById: async (userId) => {
      const res = await fetch(`http://127.0.0.1:5001/z-users-manager/us-central1/deleteUserById?userId=${userId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Erro ao remover usuário');
    }
  };

  useEffect(() => {
    api.getUserList().then(setUserList).catch(err => message.error(err.message)).finally(() => setLoading(false));
  }, []);

  const handleCreateUser = async () => {
    try {
      setCreateLoading(true);
      const values = await form.validateFields();
      const res = await api.createUser(values);
      const newUser = await api.getUserById(res.userId);
      setUserList(prev => [...prev, newUser]);
      message.success('Usuário criado com sucesso');
      form.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      message.error(error.message);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    editForm.setFieldsValue(user);
    setEditModalVisible(true);
  };

  const handleUpdateUser = async () => {
    try {
      const values = await editForm.validateFields();
      await api.updateUser(editingUser.id, values);
      message.success('Usuário atualizado');
      const updated = await api.getUserList();
      setUserList(updated);
      setEditModalVisible(false);
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await api.deleteUserById(userId);
      message.success('Usuário removido');
      setUserList(await api.getUserList());
    } catch (error) {
      message.error(error.message);
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 100 },
    { title: 'Email', dataIndex: 'email' },
    {
      title: 'Permissões',
      dataIndex: 'permissions',
      render: (permissions) => {
        const safePermissions = Array.isArray(permissions) ? permissions : [];
        return safePermissions.length > 0
          ? safePermissions.map(p => <Tag key={p}>{p}</Tag>)
          : <Tag color="default">Nenhuma</Tag>;
      }      
    },
    { title: 'Criado em', dataIndex: 'createdAt' },
    { title: 'Atualizado em', dataIndex: 'updatedAt' },
    {
      title: 'Ações',
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEditUser(record)}>Editar</Button>
          <Popconfirm
            title="Tem certeza que deseja excluir este usuário?"
            onConfirm={() => handleDeleteUser(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button type="link" danger>Excluir</Button>
          </Popconfirm>
        </>
      )
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: 16 }}>
        Adicionar Usuário
      </Button>

      <CreateUserModal
        visible={isModalVisible}
        onCancel={() => { setIsModalVisible(false); form.resetFields(); }}
        onCreate={handleCreateUser}
        loading={createLoading}
        form={form}
      />

      <Modal
        title="Editar Usuário"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleUpdateUser}
        okText="Salvar"
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="email" label="Email" rules={[{ required: true }, { type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="permissions" label="Permissões">
            <CheckboxGroup options={AVAILABLE_PERMISSIONS} />
          </Form.Item>
        </Form>
      </Modal>

      <Table
        columns={columns}
        rowKey="id"
        dataSource={userList}
        loading={loading}
        pagination={{
          pageSize: 10,
          showTotal: (total) => `Total de ${total} usuários`,
        }}
        locale={{
          emptyText: 'Nenhum usuário encontrado',
        }}
      />
    </div>
  );
}
