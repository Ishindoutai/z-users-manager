import React from 'react';
import { Form, Select } from 'antd';

const { Option } = Select;

const permissionOptions = [
  { value: 'admin', label: 'Administrator' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
  { value: 'manager', label: 'Manager' },
];

const EditableCell = ({
  editing,
  dataIndex,
  title,
  record,
  children,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[{ 
            required: true, 
            message: `${title} is required`,
            type: 'array',
            min: 1,
          }]}
        >
          <Select 
            mode="multiple" 
            placeholder="Select permissions"
            options={permissionOptions}
          />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default EditableCell;