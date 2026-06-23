export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
};

export type PaginatedData<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type CurrentUser = {
  id: string;
  email: string;
  name?: string;
  role: "admin" | "user" | "guest";
};
