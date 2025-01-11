import React, { useState, useEffect } from 'react';
import { Stock } from '../types';
import { X } from 'lucide-react';

interface StockFormProps {
  stock?: Stock;
  onSubmit: (stock: Partial<Stock>) => void;
  onClose: () => void;
}

// List of major Indian stocks for suggestions
const INDIAN_STOCKS = [
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.' },
  { symbol: 'TCS', name: 'Tata Consultancy Services Ltd.' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.' },
  { symbol: 'INFY', name: 'Infosys Ltd.' },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd.' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.' },
  { symbol: 'SBIN', name: 'State Bank of India' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.' },
  { symbol: 'ITC', name: 'ITC Ltd.' },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd.' }
];

export function StockForm({ stock, onSubmit, onClose }: StockFormProps) {
  const [formData, setFormData] = useState({
    symbol: stock?.symbol || '',
    company_name: stock?.company_name || '',
    quantity: stock?.quantity || 1,
    purchase_price: stock?.purchase_price || 0,
    current_price: stock?.current_price || 0,
  });
  const [filteredStocks, setFilteredStocks] = useState(INDIAN_STOCKS);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filter stocks based on input
  useEffect(() => {
    const filtered = INDIAN_STOCKS.filter(
      stock => stock.symbol.toLowerCase().includes(formData.symbol.toLowerCase()) ||
               stock.name.toLowerCase().includes(formData.symbol.toLowerCase())
    );
    setFilteredStocks(filtered);
  }, [formData.symbol]);

  // Simulate fetching current stock price
  const fetchCurrentPrice = async (symbol: string) => {
    // In a real application, you would fetch from a stock API
    // For demo, we'll generate a random price between 100 and 10000
    return Math.floor(Math.random() * (10000 - 100 + 1) + 100);
  };

  const handleStockSelect = async (stock: typeof INDIAN_STOCKS[0]) => {
    const currentPrice = await fetchCurrentPrice(stock.symbol);
    setFormData({
      ...formData,
      symbol: stock.symbol,
      company_name: stock.name,
      current_price: currentPrice
    });
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Fetch latest price before submitting
    const currentPrice = await fetchCurrentPrice(formData.symbol);
    const validatedData = {
      ...formData,
      current_price: currentPrice,
      quantity: Math.max(1, parseInt(String(formData.quantity)) || 1),
      purchase_price: Math.max(0, parseFloat(String(formData.purchase_price)) || 0),
    };
    onSubmit(validatedData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {stock ? 'Edit Stock' : 'Add New Stock'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                Stock Symbol
              </label>
              <input
                type="text"
                value={formData.symbol}
                onChange={(e) => {
                  setFormData({ ...formData, symbol: e.target.value.toUpperCase() });
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
              {showSuggestions && filteredStocks.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
                  {filteredStocks.map((stock) => (
                    <button
                      key={stock.symbol}
                      type="button"
                      onClick={() => handleStockSelect(stock)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      <div className="font-medium">{stock.symbol}</div>
                      <div className="text-sm text-gray-500">{stock.name}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input
                type="text"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                value={String(formData.quantity)}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Purchase Price (₹)
              </label>
              <input
                type="number"
                value={String(formData.purchase_price)}
                onChange={(e) => setFormData({ ...formData, purchase_price: parseFloat(e.target.value) || 0 })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                step="0.01"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Current Price (₹)
              </label>
              <input
                type="number"
                value={String(formData.current_price)}
                readOnly
                className="mt-1 block w-full rounded-md bg-gray-50 border-gray-300 shadow-sm"
              />
              <p className="mt-1 text-sm text-gray-500">Current price is fetched automatically</p>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {stock ? 'Update' : 'Add'} Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}