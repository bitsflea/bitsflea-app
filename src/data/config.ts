export default {
    apiRPC: "https://api.bitsflea.com",
    // apiRPC: "http://localhost:3000",
    chainAPI: "http://localhost:5173/api",
    contracts: {
        Bitsflea: "tNULSeBaN666jUUFtq1vkWUbfPPuq8iTgzsNn2"
    },
    currencies: [
        { value: '0,0', label: 'BTF', decimals: 8 },
        { value: '2,1', label: 'NULS', decimals: 8 },
        { value: '2,201', label: 'BTC', decimals: 8 },
        { value: '2,202', label: 'ETH', decimals: 18 },
        { value: '5,7', label: 'USDT', decimals: 6 }
    ],
    default_item_details: {
        condition: ["Gently used", "All original parts", "Fully functional", "Minor wear and tear"],
        shipping: ["Secure packaging", "Tracked shipping", "Insurance included", "2-3 business days"]
    },
    topic_file: 'bitsflea-file-topic'

}