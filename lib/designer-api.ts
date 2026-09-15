import { api } from "./api";
import type { Product } from "./types";

export interface DesignerMe {
  id: string;
  name: string;
  email: string;
  phone: string;
  commissionPct: number;
  isActive: boolean;
  shipViolationCount: number;
}

export interface DesignerStats {
  commissionPct: number;
  totalSalesGross: number;
  eligibleNet: number;
  pendingClearanceGross: number;
  availableBalance: number;
  productCount: number;
  pendingProductCount: number;
  orderCount: number;
}

export interface PayoutRequest {
  id: string;
  designerId: string;
  amount: string;
  status: "PENDING" | "PAID" | "REJECTED";
  requestedAt: string;
  paidAt: string | null;
}

export const designerApi = {
  me: () => api.get<DesignerMe>("/designers/me"),
  login: (email: string, password: string) => api.post<{ id: string; name: string; email: string }>("/designers/login", { email, password }),
  logout: () => api.post("/designers/logout"),
  stats: () => api.get<DesignerStats>("/designers/me/stats"),
  myProducts: () => api.get<Product[]>("/designers/me/products"),
  submitProduct: (data: Record<string, unknown>) => api.post<Product>("/designers/me/products", data),
  myPayouts: () => api.get<PayoutRequest[]>("/designers/me/payouts"),
  requestPayout: (amount: number) => api.post<PayoutRequest>("/designers/me/payouts", { amount }),
};
