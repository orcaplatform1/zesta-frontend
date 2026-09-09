export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
  position: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  stock: number | null;
  priceDelta: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  salePrice: string | null;
  sku: string;
  stock: number;
  productionTime: string | null;
  isActive: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
  category: Category | null;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  unitPrice: string;
  lineTotal: number;
  product: { name: string; slug: string; image: string | null };
  variant: { name: string; value: string } | null;
}

export interface CartSummary {
  id: string;
  items: CartItem[];
  subtotal: number;
}

export interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  email: string;
  fullName: string;
  city: string;
  district: string;
  addressLine: string;
  subtotal: string;
  shippingCost: string;
  discountTotal: string;
  total: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
  shipment: { carrier: string | null; trackingNumber: string | null } | null;
}

export interface Page {
  slug: string;
  title: string;
  content: string;
}
