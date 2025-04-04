export default {
    apiRPC: "https://api.bitsflea.com",
    // apiRPC: "http://localhost:3000",
    // chainAPI: "http://localhost:5173/api",
    chainAPI: "https://api.nuls.io/jsonrpc/",
    contracts: {
        Bitsflea: "NULSd6Hh1LacznpTiQ7K7vKbbnqARVRriZgZM",
        Point: "NULSd6HgpLnG95UKDdS7seHhTWYMkQAX4dskN"
    },
    googleAPIKey: "QUl6YVN5QnpGVHJaanM3YWg4MXdxYWpaaEVGMl9iUWg1LU12cU9F",
    currencies: [
        // { value: '0,0', label: 'BTF', decimals: 8 },
        { value: '2,1', label: 'NAI', decimals: 4 },
        { value: '2,201', label: 'BTC', decimals: 8 },
        { value: '2,202', label: 'ETH', decimals: 18 },
        { value: '5,7', label: 'USDT', decimals: 6 },
        { value: '5,1', label: 'NVT', decimals: 8 }
    ],
    default_item_details: {
        condition: ["Gently used", "All original parts", "Fully functional", "Minor wear and tear"],
        shipping: ["Secure packaging", "Tracked shipping", "Insurance included", "2-3 business days"]
    },
    topic_file: 'bitsflea-file-topic',
    KEY_REF: 'ref',
    KEY_USER: 'userInfo'

}