import { showToastGlobal } from '../context/ToastContext';

export const ErrorInfo: Map<string, string> = Object.freeze(new Map([
    ["20010", "You cannot buy the products you posted"],
    ["1001", "Parameter error"],
    ["10001", "Already registered"],
    ["10002", "Already a reviewer"],
    ["10003", "User does not exist"],
    ["10004", "User has been locked"],
    ["10005", "Batch transfer failed"],
    ["20001", "Product already exists"],
    ["20002", "Product inventory cannot be 0"],
    ["20003", "Invalid product id"],
    ["20004", "Invalid sales method"],
    ["20005", "Invalid delivery method"],
    ["20006", "Product does not exist"],
    ["20007", "Incorrect item status"],
    ["20008", "The product is not Msg.sender()"],
    ["20009", "Invalid order id"],
    ["20010", "You cannot buy the products you posted"],
    ["20011", "Invalid order status"],
    ["20012", "The order is not yours"],
    ["20013", "The tracking number is too long"],
    ["20014", "Invalid return instructions"],
    ["20015", "The product does not support return"],
    ["20016", "Invalid return status"],
    ["20017", "No more extensions are allowed. The number of extensions has been exceeded"],
    ["20018", "Inconsistent payment methods"],
    ["20019", "Failed to transfer points"],
    ["20020", "Invalid amount"],
    ["20021", "Only the contract owner is allowed to execute"],
    ["20022", "Invalid assets"],
    ["20023", "Illegal call to contract"],
    ["20024", "Product type already exists"],
    ["20025", "Invalid product type"],
    ["30001", "Can't vote for yourself"],
    ["30002", "Reviewer record does not exist"],
    ["30003", "A maximum of 100 people can vote"],
    ["30004", "You have already voted for this reviewer"],
    ["30005", "You are not a reviewer"],
    ["30006", "The reviewer did not provide a reason when delist the product"],
    ["30007", "Cannot review own products"],
    ["30008", "The product has been reviewed"],
    ["30009", "Invalid arbitration type"],
    ["30010", "Complaints against reviewers can only be initiated by ordinary users"],
    ["30011", "Cannot participate in its own arbitration proceedings"],
    ["30012", "Invalid arbitration status"],
    ["30013", "You are already in arbitration"],
    ["30014", "You have already voted"],
    ["30015", "The number of reviewers has reached the upper limit"],
    ["30016", "Only participating reviewers are allowed to operate"],
    ["30017", "No supporting materials provided"]
]));

export const safeExecuteAsync = async (callback: Function, errorTitle?: string, finallyCallback?: Function) => {
    try {
        const result = await callback();
        if ("error" in result) {
            showToastGlobal("error", result.error.message)
            return null
        }
        return result
    } catch (e: any) {
        if (e instanceof Error || (typeof e === "object" && "message" in e)) {
            showToastGlobal("error", e.message)
        } else if (typeof e === "string") {
            let info = ErrorInfo.get(e.replace(/\"/g, "").trim())
            let msg = info ? info : e
            showToastGlobal("error", msg)
        } else {
            if (errorTitle == null || errorTitle == undefined || errorTitle === "") {
                errorTitle = "Unknown error:"
            }
            console.error(errorTitle, e);
        }
        return null;
    } finally {
        if (finallyCallback) {
            finallyCallback()
        }
    }
};