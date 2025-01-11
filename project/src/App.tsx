import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Stock, PortfolioMetrics } from './types';
import { Dashboard } from './components/Dashboard';
import { StockList } from './components/StockList';
import { StockForm } from './components/StockForm';
import { Plus } from 'lucide-react';

function App() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStock, setEditingStock] = useState<Stock | undefined>();
  const [metrics, setMetrics] = useState<PortfolioMetrics>({
    totalValue: 0,
    totalGainLoss: 0,
    topPerformer: null,
    worstPerformer: null,
  });
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchStocks();
    }
  }, [user]);

  useEffect(() => {
    calculateMetrics();
  }, [stocks]);

  const fetchStocks = async () => {
    const { data, error } = await supabase
      .from('stocks')
      .select('*');

    if (error) {
      console.error('Error fetching stocks:', error);
      return;
    }

    setStocks(data || []);
  };

  const calculateMetrics = () => {
    if (stocks.length === 0) return;

    const totalValue = stocks.reduce(
      (sum, stock) => sum + stock.current_price * stock.quantity,
      0
    );

    const totalGainLoss = stocks.reduce(
      (sum, stock) =>
        sum + (stock.current_price - stock.purchase_price) * stock.quantity,
      0
    );

    const sortedByPerformance = [...stocks].sort(
      (a, b) =>
        (b.current_price - b.purchase_price) / b.purchase_price -
        (a.current_price - a.purchase_price) / a.purchase_price
    );

    setMetrics({
      totalValue,
      totalGainLoss,
      topPerformer: sortedByPerformance[0] || null,
      worstPerformer: sortedByPerformance[sortedByPerformance.length - 1] || null,
    });
  };

  const handleSubmit = async (stockData: Partial<Stock>) => {
    if (!user) {
      console.error('User must be logged in to perform this action');
      return;
    }

    const stockWithUserId = {
      ...stockData,
      user_id: user.id,
    };

    if (editingStock) {
      const { error } = await supabase
        .from('stocks')
        .update(stockWithUserId)
        .eq('id', editingStock.id);

      if (error) {
        console.error('Error updating stock:', error);
        return;
      }
    } else {
      const { error } = await supabase
        .from('stocks')
        .insert([stockWithUserId]);

      if (error) {
        console.error('Error adding stock:', error);
        return;
      }
    }

    setShowForm(false);
    setEditingStock(undefined);
    fetchStocks();
  };

  const handleEdit = (stock: Stock) => {
    setEditingStock(stock);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!user) {
      console.error('User must be logged in to perform this action');
      return;
    }

    const { error } = await supabase
      .from('stocks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting stock:', error);
      return;
    }

    fetchStocks();
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (authMode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4">Portfolio Tracker</h1>
          <form onSubmit={handleAuth} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <button
              onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              {authMode === 'signin'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Portfolio Tracker</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Stock
            </button>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Sign Out
            </button>
          </div>
        </div>

        <Dashboard stocks={stocks} metrics={metrics} />
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Stocks</h2>
          <StockList
            stocks={stocks}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {showForm && (
          <StockForm
            stock={editingStock}
            onSubmit={handleSubmit}
            onClose={() => {
              setShowForm(false);
              setEditingStock(undefined);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;