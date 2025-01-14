export interface Coordinates {
  lat: number;
  lng: number;
}

export interface LocationData {
  name: string;
  coordinates: Coordinates;
  districts?: { [key: string]: Coordinates };
}

export interface RegionData {
  name: string;
  regions: { [key: string]: LocationData };
}

export interface LocationValue {
  country: string;
  region: string;
  district?: string;
  coordinates: Coordinates;
}

export interface Product {
  category: number;
  description: string;
  isNew: boolean;
  isRetail: boolean;
  isReturns: boolean;
  pickupMethod: number;
  pid: string;
  position: string;
  postage: string;
  price: string;
  publishTime: number;
  reviewer: Record<string, unknown> | null;
  saleMethod: number;
  status: number;
  stockCount: number;
  uid: string;
}

export interface ProductInfo {
  id: string;
  name: string;
  images: string[];
  description: string;
  price: string;
  condition: string[];
  shipping: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Shop {
  id: number;
  name: string;
  avatar: string;
  description: string;
  joinDate: string;
  productCount: number;
  followerCount: number;
  rating: number;
}

export interface Address {
  id: number;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  address: string;
  isDefault: boolean;
}

// 商品发布状态
export enum ProductStatus {
  /**
   * 发布中
   */
  PUBLISH = 0,
  /**
   * 正常
   */
  NORMAL = 100,
  /**
   * 完成交易
   */
  COMPLETED = 200,
  /**
   * 下架
   */
  DELISTED = 300,
  /**
   * 锁定中
   */
  LOCKED = 400
}

// 订单状态
export enum OrderStatus {
  PendingPayment = 0, // 待付款
  PendingConfirmation = 100, // 待确认
  Cancelled = 200, // 已取消
  PendingShipment = 300, // 待发货
  PendingReceipt = 400, // 待收货
  PendingSettlement = 500, // 待结算
  Completed = 600, // 已完成
  InArbitration = 700, // 仲裁中
  Returning = 800 // 退货中
}

export interface Order {
  oid: string;
  pid: string;
  seller: string;
  buyer: string;
  amount: string;
  postage: string;
  status: OrderStatus;
  shipmentNumber: string;
  createTime: number;
  payTime: number | null;
  payTimeOut: number | null;
  shipTime: number | null;
  shipTimeOut: number | null;
  receiptTime: number | null;
  receiptTimeOut: number | null;
  endTime: number | null;
  delayedCount: string;
  clearTime: number;
  product: Product;
}