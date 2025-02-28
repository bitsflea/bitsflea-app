import { HeliaLibp2p } from "helia";
import { Libp2p } from 'libp2p'
import { Identify } from "@libp2p/identify"
import type { KadDHT } from '@libp2p/kad-dht'
import { PubSub } from '@libp2p/interface'
import { NULSAPI } from "nuls-api-v2";
import { unixfs } from "@helia/unixfs";
import { GossipsubEvents } from "@chainsafe/libp2p-gossipsub";
import jaysonPromiseBrowserClient from "jayson/promise/lib/client/browser";
import BigNumber from "bignumber.js";
import { type JSON as HJSON } from '@helia/json'

export interface UserInfo {
  /**
     * 用户地址
     */
  uid: string;
  /**
   * 状态，值对应 UserStatus
   */
  status: number;
  /**
   * 是否是评审员
   */
  isReviewer: boolean;
  /**
   * 昵称
   */
  nickname: string;
  /**
   * 头像
   */
  head: string;
  /**
   * 电话号hash
   */
  phoneHash: string;
  /**
   * 加密过后的电话
   */
  phoneEncrypt: string;
  /**
   * 用户扩展信息,如社交账号等。CID
   */
  extendInfo: string;
  /**
   * 引荐人地址
   */
  referrer: string;
  /**
   * 信用分
   */
  creditValue: number;
  /**
   * 最后活跃时间
   */
  lastActiveTime: number;
  /**
   * 发布商品总数量
   */
  postsTotal: number;
  /**
   * 卖出商品总数量
   */
  sellTotal: number;
  /**
   * 买入商品总数量
   */
  buyTotal: number;
  /**
   * 引荐总数量
   */
  referralTotal: number;
  /**
   * 加密用公钥,为地址公钥
   */
  encryptKey: string;
}

export interface UserExtendInfo {
  /**
   * X账户名,原推特号
   */
  x: string;
  /**
   * telegram号
   */
  tg: string;
  /**
   * 电子邮件
   */
  e: string;
  /**
   * 自述
   */
  d: string;
}

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
  info: ProductInfo;
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
  id: string;
  name: string;
  avatar: string;
  description: string;
  lastActiveTime: number;
  productCount: number;
  sellCount: number;
  rating: number;
}

export interface Address {
  id: number;
  name: string;
  phone: string;
  location: LocationValue;
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
  receiptInfo: string;
  product: Product;
}

export interface Nabox {
  createSession: () => Promise<any>;
  contractCall: (data: any) => Promise<string>;
  decryptData: (data: any) => Promise<any>;
  getPub: (data: any) => Promise<any>;
}

export interface BitsFlea {
  getUser: (address: string) => Promise<UserInfo | null>
  newProductId: (address: string) => Promise<BigNumber | null>
  newOrderId: (address: string, pid: string) => Promise<BigNumber | null>
  getProduct: (pid: string) => Promise<Product | null>
  getProductReturn: (oid: string) => Promise<ProductReturn | null>
  getUsersByIds: (ids: string[]) => Promise<UserInfo[]>
  getProductsByIds: (ids: string[]) => Promise<Product[]>
  getGlobal: () => Promise<any>
}

export interface HeliaContextType {
  helia: HeliaLibp2p<Libp2p<{
    identify: Identify;
    dcutr: unknown;
    dht: KadDHT;
    pubsub: PubSub<GossipsubEvents>;
  }>> | null;
  fs: ReturnType<typeof unixfs> | null;
  nuls: NULSAPI | null;
  loading: boolean;
  // error: unknown;
  bitsflea: BitsFlea | null;
  rpc: jaysonPromiseBrowserClient | null;
  userDB: any;
  json: HJSON | null;
}

export interface Reviewer {
  againstCount: number,
  approveCount: number,
  createTime: number,
  lastActiveTime: number,
  uid: string,
  voted: string,
  creditValue: number,
  extendInfo: string,
  head: string,
  isReviewer: boolean,
  nickname: string
}

export interface Price {
  value: number,
  assetId: string,
  symbol: string,
  decimals: number
}

export interface ProductReturn {
  /**
   * 订单id
   */
  oid: string,
  /**
   * 商品
   */
  pid: string,

  /**
   * 状态,值对应 ReturnStatus
   */
  status: number,
  /**
   * 退货原因
   */
  reasons: string,
  /**
   * 物流单号
   */
  shipmentsNumber: string,
  /**
   * 创建时间
   */
  createTime: number,
  /**
   * 发货时间
   */
  shipTime: number,
  /**
   * 发货超时时间
   */
  shipTimeOut: number,
  /**
   * 收货时间
   */
  receiptTime: number,
  /**
   * 收货超时时间
   */
  receiptTimeOut: number,
  /**
   * 完成时间
   */
  endTime: number,
  /**
   * 延期收货次数
   */
  delayedCount: number
}

export interface ReturnReason {
  reason: string,
  images: string[]
}