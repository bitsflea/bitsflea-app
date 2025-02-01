import React, { createContext, useContext, useState, useEffect } from 'react'
import { createHelia, HeliaLibp2p } from 'helia';
import { unixfs } from '@helia/unixfs';
import { privateKeyToProtobuf, privateKeyFromProtobuf, generateKeyPair } from "@libp2p/crypto/keys"
import { webRTC } from '@libp2p/webrtc'
import { webSockets } from '@libp2p/websockets'
import { circuitRelayTransport } from '@libp2p/circuit-relay-v2'
import { gossipsub, GossipsubEvents } from "@chainsafe/libp2p-gossipsub";
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
import { BitsFlea, HeliaContextType } from '../types';
import { PubSub } from '@libp2p/interface';
import { CID } from 'multiformats/cid'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'
import drain from 'it-drain'
import { getClient } from '../utils/client';
import jaysonPromiseBrowserClient from "jayson/promise/lib/client/browser";
// @ts-ignore
import { createOrbitDB } from '@orbitdb/core';


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
            pubsub: gossipsub({ allowPublishToZeroTopicPeers: true, emitSelf: true, canRelayMessage: true }),
            // pubsub: gossipsub()
        },
        peerDiscovery: [
            bootstrap({
                list: [
                    // "/ip4/192.168.0.105/tcp/61713/ws/p2p/12D3KooWT36TURqwnygqydMHCT4fFeHdGibgW7EwcWGaj9CEnk3h",
                    "/dns4/wss.bitsflea.com/tcp/443/wss/p2p/12D3KooWT36TURqwnygqydMHCT4fFeHdGibgW7EwcWGaj9CEnk3h",
                    '/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ',
                    '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
                    '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
                    '/dnsaddr/bootstrap.libp2p.io/p2p/QmZa1sAxajnQjVM8WjWXoMbmPd7NsWhfKsPkErzpm9wGkp',
                    '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
                    '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt',
                ],
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
    const [nuls, setNuls] = useState<NULSAPI | null>(null);
    const [helia, setHelia] = useState<HeliaLibp2p<Libp2p<{
        identify: Identify;
        dcutr: unknown;
        dht: KadDHT;
        pubsub: PubSub<GossipsubEvents>;
    }>> | null>(null)
    const [fs, setFs] = useState<ReturnType<typeof unixfs> | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<unknown>(null)
    const [bitsflea, setBitsflea] = useState<BitsFlea | null>(null)
    const [rpc, setRpc] = useState<jaysonPromiseBrowserClient | null>(null)
    const [userDB, setUserDB] = useState(null)

    const onPin = (evt: any) => {
        console.log("onPin:", evt)
    }

    useEffect(() => {
        const nulsInstance = new NULSAPI({ rpcURL: config.chainAPI, isBeta: config.contracts.Bitsflea.startsWith("tNULS") });
        setNuls(nulsInstance);
        setRpc(getClient());
        const initializeHelia = async () => {
            try {
                setLoading(true);
                setError(null);

                const { pri, uid } = await initPriKey()
                const option = createOption(pri)
                const libp2p = await createLibp2p(option);

                console.log("PeerId:", libp2p.peerId.toString());

                libp2p.services.pubsub.addEventListener('message', async (evt) => {
                    console.log("evt:", evt.detail.topic);
                    if (evt.detail.topic === config.topic_file) {
                        try {
                            const cid = CID.parse(uint8ArrayToString(evt.detail.data));
                            const isPin = await heliaInstance.pins.isPinned(cid);
                            if (!isPin) {
                                const pinResult = heliaInstance.pins.add(cid, { onProgress: onPin });
                                if (pinResult) {
                                    await drain(pinResult);
                                }
                            }
                        } catch (e) {
                            console.error(e)
                        }
                    }
                });
                libp2p.services.pubsub.subscribe(config.topic_file);

                libp2p.addEventListener('peer:discovery', async (evt) => {
                    const peerId = evt.detail.id.toString();
                    // console.log(`Discovered peer: ${peerId}`);
                    const peerIds = libp2p.getPeers().map(p => p.toString())
                    if (peerIds.includes(evt.detail.id.toString()) === false) {
                        console.debug(`connect to ${peerId}`)
                        await libp2p.dial(evt.detail.id).catch(console.debug)
                    }
                });

                libp2p.addEventListener('peer:connect', (evt) => {
                    const connectedPeer = evt.detail
                    // console.log(connectedPeer)
                    const peerId = connectedPeer.toString()
                    console.log(`Connected to peer: ${peerId}`)
                })

                const blockstore = new IDBBlockstore(`bitsflea-node-${uid}`)
                await blockstore.open();

                // 初始化 Helia 和 UnixFS
                const heliaInstance = await createHelia({ libp2p, blockstore })

                const fsInstance = unixfs(heliaInstance)

                heliaInstance.libp2p.services.pubsub.subscribe(config.topic_file)

                // 初始化数据库
                const orbitdb = await createOrbitDB({ ipfs: heliaInstance, id: uid, directory: `bitsflea-user-data` })
                const userDB = await orbitdb.open("/orbitdb/zdpuAsJkrPQ9yVYVVGzAz4aeaCxLvxYL7xdrEED6HwU8inNEV")


                // 初始化 Bitsflea 合约
                const bitsfleaInstance = await nulsInstance.contract(config.contracts.Bitsflea)
                // console.log("bitsfleaInstance:", bitsfleaInstance);

                setUserDB(userDB)
                setHelia(heliaInstance)
                setFs(fsInstance)
                setBitsflea(bitsfleaInstance)
            } catch (err) {
                console.error('Failed to initialize Helia:', err)
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        initializeHelia();
    }, []);

    return (
        <HeliaContext.Provider value={{ helia, fs, loading, error, nuls, bitsflea, rpc, userDB }}>
            {children}
        </HeliaContext.Provider>
    );
};

// 自定义 Hook 方便使用
export const useHelia = () => {
    const context = useContext(HeliaContext);
    if (!context) {
        throw new Error('useHelia must be used within a HeliaProvider');
    }
    return context;
};
