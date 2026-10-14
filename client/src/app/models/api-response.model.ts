export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  source?: string;
  count?: number;
  data?: T;
  insertId?: number;
}

export interface HealthStatus {
  status: string;
  service: string;
  timestamp: string;
  database: {
    connected: boolean;
    mode: string;
    message?: string;
    error?: string;
    troubleshooting?: string;
  };
}

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalRevenue: number;
  lowStockCount: number;
}

export interface SubqueryResultSection {
  title: string;
  sql: string;
  data: any[];
}

export interface SubqueriesResponse {
  success: boolean;
  concept: string;
  scalarSubquery: SubqueryResultSection;
  inSubquery: SubqueryResultSection;
  existsSubquery: SubqueryResultSection;
}
