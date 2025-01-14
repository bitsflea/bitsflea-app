import { Order, OrderStatus } from '../types';
import { products } from './products';

export const orders: Order[] = [
  {
    oid: "ORDER001",
    pid: "PROD001",
    seller: "John Doe",
    buyer: "Current User",
    amount: "199.99",
    postage: "0",
    status: OrderStatus.PendingPayment,
    shipmentNumber: "",
    createTime: Date.now() - 3600000, // 1 hour ago
    payTime: null,
    payTimeOut: Date.now() + 3600000, // 1 hour from now
    shipTime: null,
    shipTimeOut: null,
    receiptTime: null,
    receiptTimeOut: null,
    endTime: null,
    delayedCount: "0",
    clearTime: Date.now() + 86400000, // 24 hours from now
    product: products[0]
  },
  {
    oid: "ORDER002",
    pid: "PROD002",
    seller: "Jane Smith",
    buyer: "Current User",
    amount: "299.99",
    postage: "10.00",
    status: OrderStatus.PendingShipment,
    shipmentNumber: "",
    createTime: Date.now() - 86400000, // 24 hours ago
    payTime: Date.now() - 82800000, // 23 hours ago
    payTimeOut: null,
    shipTime: null,
    shipTimeOut: Date.now() + 86400000, // 24 hours from now
    receiptTime: null,
    receiptTimeOut: null,
    endTime: null,
    delayedCount: "0",
    clearTime: Date.now() + 172800000, // 48 hours from now
    product: products[1]
  },
  {
    oid: "ORDER003",
    pid: "PROD003",
    seller: "Mike Johnson",
    buyer: "Current User",
    amount: "79.99",
    postage: "5.00",
    status: OrderStatus.PendingReceipt,
    shipmentNumber: "TRACK123456",
    createTime: Date.now() - 172800000, // 48 hours ago
    payTime: Date.now() - 169200000, // 47 hours ago
    payTimeOut: null,
    shipTime: Date.now() - 86400000, // 24 hours ago
    shipTimeOut: null,
    receiptTime: null,
    receiptTimeOut: Date.now() + 432000000, // 5 days from now
    endTime: null,
    delayedCount: "0",
    clearTime: Date.now() + 604800000, // 7 days from now
    product: products[2]
  },
  {
    oid: "ORDER004",
    pid: "PROD004",
    seller: "Sarah Wilson",
    buyer: "Current User",
    amount: "129.99",
    postage: "0",
    status: OrderStatus.Completed,
    shipmentNumber: "TRACK789012",
    createTime: Date.now() - 604800000, // 7 days ago
    payTime: Date.now() - 601200000, // 6 days 23 hours ago
    payTimeOut: null,
    shipTime: Date.now() - 518400000, // 6 days ago
    shipTimeOut: null,
    receiptTime: Date.now() - 259200000, // 3 days ago
    receiptTimeOut: null,
    endTime: Date.now() - 259200000, // 3 days ago
    delayedCount: "0",
    clearTime: Date.now() + 2592000000, // 30 days from now
    product: products[3]
  },
  {
    oid: "ORDER005",
    pid: "PROD005",
    seller: "Tom Brown",
    buyer: "Current User",
    amount: "499.99",
    postage: "15.00",
    status: OrderStatus.Cancelled,
    shipmentNumber: "",
    createTime: Date.now() - 432000000, // 5 days ago
    payTime: null,
    payTimeOut: Date.now() - 428400000, // 4 days 23 hours ago
    shipTime: null,
    shipTimeOut: null,
    receiptTime: null,
    receiptTimeOut: null,
    endTime: Date.now() - 428400000, // 4 days 23 hours ago
    delayedCount: "0",
    clearTime: Date.now() + 2592000000, // 30 days from now
    product: products[4]
  },
  {
    oid: "ORDER006",
    pid: "PROD006",
    seller: "Mike Johnson",
    buyer: "Current User",
    amount: "79.99",
    postage: "5.00",
    status: OrderStatus.Returning,
    shipmentNumber: "TRACK123456",
    createTime: Date.now() - 172800000, // 48 hours ago
    payTime: Date.now() - 169200000, // 47 hours ago
    payTimeOut: null,
    shipTime: Date.now() - 86400000, // 24 hours ago
    shipTimeOut: null,
    receiptTime: null,
    receiptTimeOut: Date.now() + 432000000, // 5 days from now
    endTime: null,
    delayedCount: "0",
    clearTime: Date.now() + 604800000, // 7 days from now
    product: products[2]
  }
];