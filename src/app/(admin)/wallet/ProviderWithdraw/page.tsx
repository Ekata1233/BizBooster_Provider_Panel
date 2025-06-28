// components/ProviderWithdraw.js
"use client"
import { useState } from "react";

export default function ProviderWithdraw() {
    const [amount, setAmount] = useState("");
    const providerId = "ftp0001"
    const handleWithdraw = async () => {
        const res = await fetch("/api/wallet/withdraw", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ providerId, amount: parseFloat(amount) }),
        });

        const data = await res.json();
        alert(data.message || "Done");
    };

    return (
        <div>
            <h3>Provider: Withdraw Money</h3>
            <input placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
            <button onClick={handleWithdraw}>Withdraw</button>
        </div>
    );
}
