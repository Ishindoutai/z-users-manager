import { useState, useEffect } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import UserTable from '../components/Users/UserTable';
import UserForm from '../components/Users/UserForm';
import useUsers from '../hooks/useUsers';

const UsersPage = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const { 
    users, 
    loading, 
    fetchUsers, 
    createUser, 
    updateUser, 
    deleteUser 
  } = useUsers();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreate = () => {
    setEditingUser(null);
    setFormVisible(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormVisible(true);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, values);
      } else {
        await createUser(values);
      }
      setFormVisible(false);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleCreate}
          loading={loading}
        >
          Add User
        </Button>
      </div>

      <UserTable 
        users={users} 
        loading={loading} 
        onEdit={handleEdit} 
        onDelete={deleteUser}
      />

      <UserForm
        visible={formVisible}
        onCancel={() => setFormVisible(false)}
        onSubmit={handleSubmit}
        initialValues={editingUser}
      />
    </div>
  );
};

export default UsersPage;