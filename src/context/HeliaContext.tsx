import React, { createContext, useContext, useState, useEffect } from 'react'
import { createHelia, HeliaLibp2p } from 'helia';
import { unixfs } from '@helia/unixfs';
import { privateKeyToProtobuf, privateKeyFromProtobuf, generateKeyPair } from "@libp2p/crypto/keys"
import { webRTC } from '@libp2p/webrtc'
import { webSockets } from '@libp2p/websockets'
import { circuitRelayTransport } from '@libp2p/circuit-relay-v2'
import { bootstrap } from '@libp2p/bootstrap'
import * as filters from '@libp2p/websockets/filters'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { dcutr } from '@libp2p/dcutr'
import { Identify, identify } from "@libp2p/identify"
import { kadDHT } from '@libp2p/kad-dht'
import type { KadDHT } from '@libp2p/kad-dht'
import { createLibp2p, Libp2p } from 'libp2p'
import { IDBBlockstore } from 'blockstore-idb'
import { NULSAPI } from "nuls-api-v2"
import config from '../data/config';

interface HeliaContextType {
    helia: HeliaLibp2p<Libp2p<{
        identify: Identify;
        dcutr: unknown;
        dht: KadDHT;
    }>> | null;
    fs: ReturnType<typeof unixfs> | null;
    nuls: NULSAPI;
    loading: boolean;
    error: unknown;
}

async function initPriKey() {
    let uid = localStorage.getItem("uid") ?? Math.floor(Math.random() * 10 ** 8).toString()
    let priJson = localStorage.getItem(uid)
    let pri;
    if (priJson == null || priJson == undefined) {
        pri = await generateKeyPair("secp256k1")
        const priJson = privateKeyToProtobuf(pri)
        localStorage.setItem("uid", uid)
        localStorage.setItem(uid, JSON.stringify(priJson))
    } else {
        pri = privateKeyFromProtobuf(Uint8Array.from(Object.values(JSON.parse(priJson))))
    }
    return { pri, uid }
}

function createOption(pri: any) {
    const option = {
        privateKey: pri,
        addresses: {
            listen: [
                '/p2p-circuit',
                '/webrtc'
            ]
        },
        transports: [
            webSockets({ filter: filters.all }),
            webRTC(),
            circuitRelayTransport()
        ],
        connectionEncrypters: [noise()],
        streamMuxers: [yamux()],
        connectionGater: {
            denyDialMultiaddr: () => { return false }
        },
        services: {
            identify: identify(),
            dcutr: dcutr(),
            dht: kadDHT({ clientMode: true }),
        },
        peerDiscovery: [
            bootstrap({
                list: [
                    "/dns4/wss.bitsflea.com/tcp/443/wss/p2p/12D3KooWT36TURqwnygqydMHCT4fFeHdGibgW7EwcWGaj9CEnk3h",
                    '/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ',
                    '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
                    '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
                    '/dnsaddr/bootstrap.libp2p.io/p2p/QmZa1sAxajnQjVM8WjWXoMbmPd7NsWhfKsPkErzpm9wGkp',
                    '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
                    '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt',
                ]
            })
        ],
        connectionManager: { maxConnections: 10 }
    }
    return option
}

// 创建上下文
const HeliaContext = createContext<HeliaContextType | null>(null);

// 提供者组件
export const HeliaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [nuls, setNuls] = useState<NULSAPI>(new NULSAPI({ rpcURL: config.chainAPI, isBeta: config.contracts.Bitsflea.startsWith("tNULS") }));
    const [helia, setHelia] = useState<HeliaLibp2p<Libp2p<{
        identify: Identify;
        dcutr: unknown;
        dht: KadDHT;
    }>> | null>(null);
    const [fs, setFs] = useState<ReturnType<typeof unixfs> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        const initializeHelia = async () => {
            try {
                setLoading(true);
                setError(null);

                const { pri, uid } = await initPriKey()
                const option = createOption(pri)
                const libp2p = await createLibp2p(option);
                const blockstore = new IDBBlockstore(`bitsflea-node-${uid}`);
                await blockstore.open();

                // 初始化 Helia 和 UnixFS
                const heliaInstance = await createHelia({ libp2p, blockstore });
                const fsInstance = unixfs(heliaInstance);

                setHelia(heliaInstance);
                setFs(fsInstance);
            } catch (err) {
                console.error('Failed to initialize Helia:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        initializeHelia();
    }, []);

    return (
        <HeliaContext.Provider value={{ helia, fs, loading, error, nuls }}>
            {children}
        </HeliaContext.Provider>
    );
};

// 自定义 Hook 方便使用
export const useHelia = () => useContext(HeliaContext);
