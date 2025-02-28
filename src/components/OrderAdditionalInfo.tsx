import React, { useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { Check, Copy } from 'lucide-react';
import { showOrderId } from '../utils/nuls';
import { getJson, isCid } from '../utils/ipfs';
import { Address } from '../types';
import { useHelia } from '../context/HeliaContext';
import { AddressCard } from './AddressCard';
import { useAuth } from '../context/AuthContext';
import { getAddresses } from '../utils/db';

interface OrderAdditionalInfoProps {
  orderId: string;
  seller: string;
  buyer: string;
  shipmentNumber?: string;
  delayedCount: string;
  deliveryInfo?: string | null;
}

export const OrderAdditionalInfo: React.FC<OrderAdditionalInfoProps> = ({
  orderId,
  seller,
  buyer,
  shipmentNumber,
  delayedCount,
  deliveryInfo
}) => {
  const { showToast } = useToast()
  const ctx = useHelia()
  const { user } = useAuth()
  const [copying, setCopying] = React.useState(false)
  const [delivery, setDelivery] = React.useState<Address | null>(null)

  useEffect(() => {
    const loadDelivery = async () => {
      if (buyer === user!.uid) {
        let obj = await getJson<{ id: number, seller: string, enMsg: string }>(ctx, deliveryInfo!)
        if (JSON.stringify(obj) !== "{}") {
          const addresses = await getAddresses(ctx.userDB, user!.uid)
          const addr = addresses.find((v) => v.id == obj.id)
          if (addr) {
            addr.isDefault = false
            setDelivery(addr)
          }
        }
      }
    }
    loadDelivery()
  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(orderId);
      setCopying(true);
      showToast('success', 'Order ID copied to clipboard');

      // Reset copying state after 1.5s
      setTimeout(() => {
        setCopying(false);
      }, 1500);
    } catch (err) {
      showToast('error', 'Failed to copy Order ID');
    }
  };

  const onViewDelivery = async () => {
    try {
      let obj = await getJson<{ seller: string, enMsg: string }>(ctx, deliveryInfo!)
      if (JSON.stringify(obj) !== "{}") {
        let msg = await window.nabox?.decryptData([obj.enMsg, user?.uid])
        if (msg) {
          try {
            const addr = JSON.parse(msg)
            addr.isDefault = false
            setDelivery(addr as Address)
          } catch { }
        }
      }
    } catch (err) {
      showToast('error', 'Failed to load delivery info');
    }
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-500">Order ID</span>
          <div className="flex items-center gap-2" title={orderId}>
            <span className="text-gray-900">{showOrderId(orderId)}</span>
            <button
              onClick={handleCopy}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              title="Copy Order ID"
            >
              {copying ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
        </div>
        {user!.uid === seller ? (
          <div className="flex justify-between py-2 border-b border-gray-100 w-full">
            <span className="text-gray-500">Buyer</span>
            <span className="text-gray-900 truncate ml-1">{buyer}</span>
          </div>
        ) : (
          <div className="flex justify-between py-2 border-b border-gray-100 w-full">
            <span className="text-gray-500">Seller</span>
            <span className="text-gray-900 truncate ml-1">{seller}</span>
          </div>
        )}

        {shipmentNumber && (
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Tracking Number</span>
            <span className="text-gray-900">{shipmentNumber}</span>
          </div>
        )}
        {delayedCount !== '0' && (
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Delayed Count</span>
            <span className="text-orange-600">{delayedCount}</span>
          </div>
        )}

        {!!delivery && (
          <AddressCard address={delivery} />
        )}

        {!!deliveryInfo && isCid(deliveryInfo) && !delivery && user?.uid === seller && (
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Delivery Info</span>
            <span className="text-orange-600">
              <button onClick={onViewDelivery}>View</button>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};