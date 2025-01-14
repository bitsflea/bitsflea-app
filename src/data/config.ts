export default {
    apiRPC: "http://localhost:3000",
    chainAPI: "http://beta.api.nuls.io/jsonrpc",
    contracts: {
        Bitsflea: "tNULSeBaN73dv3qnxNjDFBnNdNp7xyaA2HnzDv"
    },
    currencies: [
        { value: '0,0', label: 'BTF' },
        { value: '2,1', label: 'NULS' },
        { value: '2,201', label: 'BTC' },
        { value: '2,202', label: 'ETH' },
        { value: '5,7', label: 'USDT' }
    ],
    default_item_details:{
        condition: ["Gently used", "All original parts", "Fully functional", "Minor wear and tear"],
        shipping: ["Secure packaging", "Tracked shipping", "Insurance included", "2-3 business days"]
    }

}