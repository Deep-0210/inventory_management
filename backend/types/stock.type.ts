export type StockType = {
    productName: string
    productQuantity: string
    productPrice: string
    email: string
}

export type SendStockData = {
    productName: string
    productQuantity: string
    productPrice: string
}

export type SendRequestedStock = {
    productName: string
    productPrice: string
    productQuantity: string
    status: "pending" | "accepted" | "rejected";
}