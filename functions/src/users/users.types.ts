export interface UserCreateRequest {
  email: string;
  password: string;
  permissions: string[];
}

export interface UserUpdateRequest {
  uid: string;
  permissions: string[];
}

export interface UserResponse {
  uid: string;
  email: string;
  permissions: string[];
}