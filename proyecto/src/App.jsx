import React, { useState } from "react";
import "./App.css";

const CURRENCIES = [
  { label: "Dólar (USD)", value: "USD", symbol: "$" },
  { label: "Euro (EUR)", value: "EUR", symbol: "€" },
  { label: "Peso Mexicano (MXN)", value: "MXN", symbol: "$" },
  { label: "Peso Colombiano (COP)", value: "COP", symbol: "$" },
  { label: "Libra Esterlina (GBP)", value: "GBP", symbol: "£" }
];

export default function App() {
  const [amount, setAmount] = useState("1");
  const [fromCurrency, setFromCurrency] = useState(CURRENCIES[0]);
  const [toCurrency, setToCurrency] = useState(CURRENCIES[1]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const convertCurrency = async () => {
    if (!amount || isNaN(amount)) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        `https://open.er-api.com/v6/latest/${fromCurrency.value}`
      );
      const data = await response.json();

      const rate = data.rates[toCurrency.value];
      const total = (parseFloat(amount) * rate).toFixed(2);

      setResult(total);
    } catch (error) {
      alert("Error al obtener tasas de cambio");
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  return (
    <div className="container">
      <div className="content">
        <h1 className="headerTitle">💱 CurrencyX</h1>

        <div className="card">
          <label className="label">Cantidad</label>

          <input
            type="number"
            className="input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
          />

          <div className="selectorRow">
            <div className="selectBox">
              <label>De:</label>
              <select
                value={fromCurrency.value}
                onChange={(e) =>
                  setFromCurrency(
                    CURRENCIES.find((c) => c.value === e.target.value)
                  )
                }
              >
                {CURRENCIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <button className="swapBtn" onClick={swapCurrencies}>
              ⇄
            </button>

            <div className="selectBox">
              <label>A:</label>
              <select
                value={toCurrency.value}
                onChange={(e) =>
                  setToCurrency(
                    CURRENCIES.find((c) => c.value === e.target.value)
                  )
                }
              >
                {CURRENCIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            className="button"
            onClick={convertCurrency}
            disabled={loading}
          >
            {loading ? "Cargando..." : "Convertir"}
          </button>

          {result && (
            <div className="resultBox">
              <p>
                {amount} {fromCurrency.value} =
              </p>
              <h2>
                {result} {toCurrency.value}
              </h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}