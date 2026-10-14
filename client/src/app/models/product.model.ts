export interface Product {
  product_id: number;
  code?: string;
  title: string;
  category_id: number;
  category_name?: string;
  price: number;
  original_price?: number;
  rating_rate?: number;
  rating_count?: number;
  deal_tag?: string;
  badge?: string;
  image: string;
  delivery_info?: string;
  stock_quantity: number;
}

export interface ProductFormData {
  title: string;
  category_id: number;
  price: number;
  original_price?: number;
  stock_quantity: number;
  deal_tag?: string;
  badge?: string;
  image?: string;
  delivery_info?: string;
}
