import React from 'react';

const StockStatusBadge = ({ stock, showQty }) => {
  const getStockStatus = (s) => {
    if (s === 0) return { text: "Out of Stock", class: "bg-slate-200 text-slate-700" };
    if (s < 10) return { text: "Low Stock", class: "bg-red-100 text-red-800" };
    if (s <= 20) return { text: "Medium Stock", class: "bg-yellow-100 text-yellow-800" };
    return { text: "High Stock", class: "bg-green-100 text-green-800" };
  };

  const status = getStockStatus(stock);

  return (
    <div className={`px-3 py-1 text-sm font-semibold rounded-full text-center ${status.class}`}>
      {showQty && stock > 0 ? `Stock (${stock})` : status.text}
    </div>
  );
};

export default StockStatusBadge;