import React, { useEffect, useState } from 'react';
import { X, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { RegisterModal } from './RegisterModal';
import { useHelia } from '../context/HeliaContext';
import config from '../data/config';
import { Nabox, UserInfo } from '../types';
import { getHash } from '../utils/nuls';
import { addImages, addUserExtendInfo } from '../utils/ipfs';
import { safeExecuteAsync } from '../data/error';
import { useLoading } from '../context/LoadingContext';
import { encryptMsg } from 'nuls-api-v2';

declare global {
  interface Window {
    NaboxWallet?: Nabox;
  }
}

interface LoginModalProps {
  onClose: () => void;
  onSuccess: () => void;
}



export const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSuccess }) => {
  const { login } = useAuth()
  const [showRegister, setShowRegister] = useState(false)
  const [connectedAddress, setConnectedAddress] = useState<string>('')
  const [globalParams, setGlobalParams] = useState<any>()
  const ctx = useHelia();
  const { showLoading, hideLoading } = useLoading()

  useEffect(() => {
    const loadGlobal = async () => {
      const g = await ctx.bitsflea!.getGlobal()
      setGlobalParams(g)
    }
    if (ctx && ctx.bitsflea) {
      loadGlobal()
    }
  }, [])

  // Get user info from localStorage
  const mockFetchUserInfo = async (address: string): Promise<UserInfo | null | undefined> => {
    const userInfo = await ctx!.bitsflea!.getUser(address);
    console.debug("userInfo:", userInfo);

    // Save to localStorage
    localStorage.setItem(config.KEY_USER, JSON.stringify(userInfo));
    return userInfo;
  };

  const handleConnectWallet = async (walletType: 'nabox' | 'metamask') => {
    if (walletType === 'nabox') {
      if ('NaboxWallet' in window) {
        const naboxInfo = await window.NaboxWallet!.nai.createSession();
        console.debug("naboxInfo:", naboxInfo)
        if (naboxInfo && naboxInfo.length > 0) {
          setConnectedAddress(naboxInfo[0]);
          await safeExecuteAsync(async () => {
            const userInfo = await mockFetchUserInfo(naboxInfo[0]);
            console.debug("userInfo:", userInfo)

            if (userInfo) {
              // User exists, proceed with login
              login(userInfo);
              onSuccess();
            } else {
              // User doesn't exist, show registration form
              setShowRegister(true);
            }
          }, "Error fetching user info:")
        }
      } else {
        console.error('Nabox not found');
        window.open('https://chromewebstore.google.com/detail/nabox-wallet/nknhiehlklippafakaeklbeglecifhad', '_blank');
      }

    }
  };

  const handleRegister = async (info: any) => {
    console.debug("info:", info)
    showLoading()
    //Create new user
    const phoneHash = getHash(info.phone);
    const phoneEncrypt = await encryptMsg(info.phone, globalParams!.encryptKey);
    console.debug("phoneEncrypt:", phoneEncrypt)

    let referrer = localStorage.getItem(config.KEY_REF);
    const avatar = info.avatar.startsWith("http") ? info.avatar : (await addImages(ctx, [info.avatar]))[0];
    const extendInfo = await addUserExtendInfo(ctx, { x: "", tg: info.tg, e: "", d: info.description });

    if (referrer != null && connectedAddress === referrer) {
      referrer = null
    }

    await safeExecuteAsync(async () => {
      const data = {
        from: connectedAddress,
        value: 0,
        contractAddress: config.contracts.Bitsflea,
        methodName: "regUser",
        methodDesc: "",
        args: [info.nickname, phoneHash, phoneEncrypt, referrer, avatar, extendInfo],
        multyAssetValues: []
      }
      const txHash = await window.NaboxWallet!.nai.contractCall(data);
      await ctx?.nuls?.waitingResult(txHash);

      const newUser = await ctx?.bitsflea?.getUser(connectedAddress);
      console.debug("newUser:", newUser);
      if (newUser) {
        // Login
        login(newUser!);
        onSuccess();
      } else {
        console.error('Failed to register user');
      }
    }, undefined, () => {
      hideLoading()
    })
  };

  if (showRegister) {
    return (
      <RegisterModal
        onClose={onClose}
        onRegister={handleRegister}
        walletAddress={connectedAddress}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="relative px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Connect Wallet</h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Wallet Options */}
        <div className="p-6 space-y-4">
          <button
            onClick={() => handleConnectWallet('nabox')}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-xl flex items-center justify-between hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-100 group"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-lg group-hover:scale-110 transition-transform">
                <Wallet className="h-6 w-6" />
              </div>
              <span className="text-lg font-medium">NaBox</span>
            </div>
            <span className="text-white/60 group-hover:translate-x-1 transition-transform">
              Recommended
            </span>
          </button>

          {/* <button
            onClick={() => handleConnectWallet('metamask')}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 rounded-xl flex items-center justify-between hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg shadow-orange-100 group"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-lg group-hover:scale-110 transition-transform">
                <Wallet className="h-6 w-6" />
              </div>
              <span className="text-lg font-medium">MetaMask</span>
            </div>
            <span className="text-white/60 group-hover:translate-x-1 transition-transform">
              Popular
            </span>
          </button> */}

          <p className="text-center text-sm text-gray-500 mt-6">
            By connecting a wallet, you agree to our{' '}
            <a href="#" className="text-primary-600 hover:text-primary-700">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-primary-600 hover:text-primary-700">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};