import React, { useEffect, useState } from 'react';
import { Package, MapPin, Heart, Store, Shield, Star, Pencil, ShoppingBag, Truck } from 'lucide-react';
import { ProductManagement } from './ProductManagement';
import { PurchaseManagement } from './PurchaseManagement';
import { AddressManagement } from './AddressManagement';
import { FavoriteManagement } from './FavoriteManagement';
import { FollowingManagement } from './FollowingManagement';
import { ProfileEditor } from './ProfileEditor';
import { useAuth } from '../context/AuthContext';
import { SalesManagement } from './SalesManagement';
import { ImageIPFS } from './ImageIPFS';
import { UserExtendInfo } from '../types';
import { addImages, addUserExtendInfo, getUserExtendInfo } from '../utils/ipfs';
import { useHelia } from '../context/HeliaContext';
import config from '../data/config';
import { formatDate } from '../utils/date';
import { useLoading } from '../context/LoadingContext';
import { useToast } from '../context/ToastContext';


const tabs = [
  { id: 'purchases', label: 'Purchases', icon: ShoppingBag },
  { id: 'sales', label: 'Sales', icon: Truck },
  { id: 'products', label: 'Listings', icon: Package },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'following', label: 'Following', icon: Store },
];

export const UserCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('purchases');
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [userExtendInfo, setUserExtendInfo] = useState<UserExtendInfo>({ x: "", tg: "", e: "", d: "" });
  const { user, login } = useAuth();
  const ctx = useHelia();
  const { showLoading, hideLoading } = useLoading();
  const { showToast } = useToast();

  // console.log("user:", user)

  useEffect(() => {
    const fetchUserExtendInfo = async () => {
      if (!user || !user.extendInfo) return;
      const info = await getUserExtendInfo(ctx, user.extendInfo);
      // console.log("info:", info)
      setUserExtendInfo(info);
    };
    fetchUserExtendInfo();
  }, [user?.extendInfo])

  const handleProfileSave = async (data: { avatar: string; nickname: string; description: string, tg: string }) => {
    showLoading()
    console.log('Profile updated:', data);
    try {
      let eInfo:any = await getUserExtendInfo(ctx, user!.extendInfo, 5000);
      console.log("eInfo:", eInfo);
      eInfo.d = data.description;
      eInfo.tg = data.tg;

      let head = null;
      let nickname = null;
      if (data.nickname != user!.nickname) {
        nickname = data.nickname;
      }

      if (data.avatar != user!.head) {
        let cids = await addImages(ctx, [data.avatar]);
        head = cids[0];
        console.log("head:", head);
      }

      eInfo = await addUserExtendInfo(ctx, eInfo);
      // console.log("eInfo:", eInfo, user!.extendInfo);
      if (eInfo === user!.extendInfo) {
        eInfo = null;
      }
      if (nickname != null || head != null || eInfo != null) {
        const callData = {
          from: user!.uid,
          value: 0,
          contractAddress: config.contracts.Bitsflea,
          methodName: "setProfile",
          methodDesc: "",
          args: [nickname, head, eInfo],
          multyAssetValues: []
        }
        const txHash = await window.nabox!.contractCall(callData);
        await ctx?.nuls?.waitingResult(txHash);
        const newUser = await ctx?.bitsflea?.getUser(user!.uid);
        login(newUser!);
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        showToast("error", e.message)
      } else {
        console.error("Unknown error");
      }
    }
    hideLoading()
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'purchases':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Purchases</h2>
            <PurchaseManagement />
          </div>
        );

      case 'sales':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Sales</h2>
            <SalesManagement />
          </div>
        );

      case 'products':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Listings</h2>
            <ProductManagement />
          </div>
        );

      case 'addresses':
        return (
          <AddressManagement
            onAddAddress={(address) => console.log('Add address:', address)}
            onEditAddress={(address) => console.log('Edit address:', address)}
          />
        );

      case 'favorites':
        return (
          <FavoriteManagement />
        );

      case 'following':
        return (
          <FollowingManagement />
        );

      default:
        return null;
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* User Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <ImageIPFS image={user.head} alt={user.nickname} className="w-20 h-20 rounded-full object-cover" />
              <button
                onClick={() => setShowProfileEditor(true)}
                className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-50 transition-colors"
              >
                <Pencil className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl font-bold text-gray-900">{user.nickname}</h1>
                    {user.isReviewer && (
                      <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                        <Shield className="h-4 w-4 fill-current" />
                        <span className="hidden md:inline">Reviewer</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="md:inline">
                        <span className="hidden md:inline">Credit Score </span>
                        {user.creditValue}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600">Last active {formatDate(user.lastActiveTime * 1000)}</p>
                </div>
                <button
                  onClick={() => setShowProfileEditor(true)}
                  className="hidden md:block text-primary-600 hover:text-primary-700 font-medium"
                >
                  Edit Profile
                </button>
              </div>
              {userExtendInfo.d && (
                <p className="text-gray-600 mt-2">{userExtendInfo.d}</p>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Desktop */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-100">
            <nav className="flex">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`
                    flex items-center gap-2 px-6 py-4 font-medium transition-colors relative
                    ${activeTab === id
                      ? 'text-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                  {activeTab === id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          {renderTabContent()}
        </div>

        {/* Profile Editor Modal */}
        {showProfileEditor && (
          <ProfileEditor
            onClose={() => setShowProfileEditor(false)}
            onSave={handleProfileSave}
            initialData={{
              avatar: user.head || '',
              nickname: user.nickname,
              description: userExtendInfo.d || '',
              tg: userExtendInfo.tg || ''
            }}
          />
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 z-50">
        <nav className="flex justify-around">
          {tabs.map(({ id, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`
                p-3 rounded-lg transition-colors
                ${activeTab === id
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-400 hover:text-gray-600'
                }
              `}
            >
              <Icon className="h-6 w-6" />
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};