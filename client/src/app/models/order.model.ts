export interface OrderItemPayload {
  product_id?: number;
  id?: number;
  title?: string;
  quantity: number;
  price?: number;
  unit_price?: number;
}

export interface CreateOrderPayload {
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  payment_method: string;
  items: OrderItemPayload[];
}

export interface Order {
  order_id: number;
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  payment_method: string;
  total_amount: number;
  order_status: string;
  created_at: string;
}

export interface OrderCreationResponse {
  success: boolean;
  message: string;
  orderId: number;
  totalAmount: number;
  itemCount: number;
  estimatedDelivery: string;
  source?: string;
}
