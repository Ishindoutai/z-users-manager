export interface User {
  uid: string;
  email: string;
  permissions: string[];
  createdAt?: string;
}

export interface UserCreateData {
  email: string;
  password: string;
  confirmPassword?: string;
  permissions: string[];
}

export interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  record: User;
  children: React.ReactNode;
}