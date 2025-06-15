type Contract = {
    expiry: string; // ISO string, can convert to Date later if needed
    type: "CE" | "PE";
    strike: number;
    symbol: string;
    id: string;
}

type Trade = {
    contract: Contract;
    quantity: number;
    transaction_type: "BUY" | "SELL";
    entry_time: string; // ISO string
    entry_price: number;
}

type BacktestResponse = {
    status: string; // "success" or other statuses
    data: Trade[];
    initial_capital: number;
}
