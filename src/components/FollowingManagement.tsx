import React, { useEffect, useState } from 'react';
import { Store } from 'lucide-react';
import { ShopCard } from './ShopCard';
import { Shop, UserInfo } from '../types';
import { useAuth } from '../context/AuthContext';
import { useHelia } from '../context/HeliaContext';
import { delFollowing, getUserData, KEY_FOLLOWING } from '../utils/db';
import { useToast } from '../context/ToastContext';


export const FollowingManagement: React.FC = ({
}) => {
  const { user } = useAuth()
  const { userDB, rpc, bitsflea } = useHelia()
  const [shops, setShops] = useState<Shop[]>([])
  const { showToast } = useToast();

  useEffect(() => {
    const loadFollowing = async () => {
      const ids = await getUserData(userDB, user!.uid, KEY_FOLLOWING)
      if (ids.length > 0) {
        // console.log("ids:", ids)
        // const data = await rpc!.request("getUsersByIds", [ids]);
        try {
          const data = await bitsflea!.getUsersByIds(ids)
          // console.log("data:", data)
          const _shops = data.map((v: UserInfo) => {
            return {
              id: v.uid,
              name: v.nickname,
              avatar: v.head,
              description: v.extendInfo,
              lastActiveTime: v.lastActiveTime,
              productCount: v.postsTotal,
              sellCount: v.sellTotal,
              rating: v.creditValue
            } as Shop
          })
          setShops(_shops)
        } catch (e: unknown) {
          if (e instanceof Error) {
            showToast("error", e.message)
          } else {
            console.error('Error getUsersByIds:', e);
          }
        }
      }
    }
    if (user && rpc) {
      loadFollowing()
    }
  }, [user])

  const onViewShop = async (shopId: string) => {
    console.log("shopId:", shopId)
  }

  const onUnfollow = async (shopId: string) => {
    const index = shops.findIndex((v) => v.id === shopId)
    if (index > -1) {
      shops.splice(index, 1)
      setShops([...shops])
      if (user && userDB) {
        await delFollowing(userDB, user.uid, shopId)
      }
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Following</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {shops.length > 0 ? (
          shops.map((shop) => (
            <ShopCard
              key={shop.id}
              shop={shop}
              onViewShop={onViewShop}
              onUnfollow={onUnfollow}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-100 md:col-span-2">
            <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No shops followed yet</p>
          </div>
        )}
      </div>
    </div>
  );
};