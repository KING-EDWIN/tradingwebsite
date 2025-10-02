import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  BarChart3,
  Play,
  Pause,
  RotateCcw,
  Wallet,
  AlertTriangle
} from "lucide-react";

interface Position {
  id: string;
  symbol: string;
  side: 'long' | 'short';
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
}

interface Order {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  type: 'market' | 'limit' | 'stop';
  status: 'pending' | 'filled' | 'cancelled';
  timestamp: Date;
}

const TradingSimulator = () => {
  const [balance, setBalance] = useState(10000);
  const [positions, setPositions] = useState<Position[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderPrice, setOrderPrice] = useState(150.00);
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop'>('market');
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');

  // Mock market data
  const marketData = {
    AAPL: { price: 150.25, change: 2.45, changePercent: 1.66 },
    TSLA: { price: 245.80, change: -5.20, changePercent: -2.07 },
    GOOGL: { price: 2850.00, change: 15.50, changePercent: 0.55 },
    MSFT: { price: 420.15, change: 3.25, changePercent: 0.78 },
    AMZN: { price: 1850.30, change: -12.40, changePercent: -0.67 }
  };

  const [currentPrices, setCurrentPrices] = useState(marketData);

  // Simulate price movements
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setCurrentPrices(prev => {
        const newPrices = { ...prev };
        Object.keys(newPrices).forEach(symbol => {
          const change = (Math.random() - 0.5) * 2; // Random change between -1 and 1
          newPrices[symbol] = {
            ...newPrices[symbol],
            price: Math.max(0.01, newPrices[symbol].price + change),
            change: newPrices[symbol].change + change,
            changePercent: ((newPrices[symbol].change + change) / (newPrices[symbol].price - change)) * 100
          };
        });
        return newPrices;
      });

      // Update positions
      setPositions(prev => prev.map(pos => {
        const newPrice = currentPrices[pos.symbol]?.price || pos.currentPrice;
        const pnl = pos.side === 'long' 
          ? (newPrice - pos.entryPrice) * pos.quantity
          : (pos.entryPrice - newPrice) * pos.quantity;
        
        return {
          ...pos,
          currentPrice: newPrice,
          pnl,
          pnlPercent: (pnl / (pos.entryPrice * pos.quantity)) * 100
        };
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulating, currentPrices]);

  const placeOrder = () => {
    const price = orderType === 'market' ? currentPrices[selectedSymbol].price : orderPrice;
    const totalCost = price * orderQuantity;

    if (orderSide === 'buy' && totalCost > balance) {
      alert('Insufficient balance');
      return;
    }

    const newOrder: Order = {
      id: Date.now().toString(),
      symbol: selectedSymbol,
      side: orderSide,
      quantity: orderQuantity,
      price,
      type: orderType,
      status: orderType === 'market' ? 'filled' : 'pending',
      timestamp: new Date()
    };

    setOrders(prev => [newOrder, ...prev]);

    if (orderType === 'market') {
      executeOrder(newOrder);
    }
  };

  const executeOrder = (order: Order) => {
    if (order.side === 'buy') {
      setBalance(prev => prev - (order.price * order.quantity));
      
      // Check if position exists
      const existingPosition = positions.find(p => p.symbol === order.symbol && p.side === 'long');
      if (existingPosition) {
        // Update existing position
        setPositions(prev => prev.map(p => 
          p.id === existingPosition.id 
            ? {
                ...p,
                quantity: p.quantity + order.quantity,
                entryPrice: (p.entryPrice * p.quantity + order.price * order.quantity) / (p.quantity + order.quantity)
              }
            : p
        ));
      } else {
        // Create new position
        const newPosition: Position = {
          id: Date.now().toString(),
          symbol: order.symbol,
          side: 'long',
          quantity: order.quantity,
          entryPrice: order.price,
          currentPrice: order.price,
          pnl: 0,
          pnlPercent: 0
        };
        setPositions(prev => [...prev, newPosition]);
      }
    } else {
      // Sell order
      const position = positions.find(p => p.symbol === order.symbol && p.side === 'long');
      if (position && position.quantity >= order.quantity) {
        setBalance(prev => prev + (order.price * order.quantity));
        
        if (position.quantity === order.quantity) {
          setPositions(prev => prev.filter(p => p.id !== position.id));
        } else {
          setPositions(prev => prev.map(p => 
            p.id === position.id 
              ? { ...p, quantity: p.quantity - order.quantity }
              : p
          ));
        }
      }
    }

    // Update order status
    setOrders(prev => prev.map(o => 
      o.id === order.id ? { ...o, status: 'filled' } : o
    ));
  };

  const totalPortfolioValue = positions.reduce((total, pos) => 
    total + (pos.currentPrice * pos.quantity), 0
  );
  const totalPnl = positions.reduce((total, pos) => total + pos.pnl, 0);
  const totalPnlPercent = totalPortfolioValue > 0 ? (totalPnl / (totalPortfolioValue - totalPnl)) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold">Trading Simulator</h2>
          <p className="text-muted-foreground">Practice trading with virtual money</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant={isSimulating ? "destructive" : "default"}
            onClick={() => setIsSimulating(!isSimulating)}
            className="flex items-center space-x-2"
          >
            {isSimulating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span>{isSimulating ? 'Pause' : 'Start'} Simulation</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setBalance(10000);
              setPositions([]);
              setOrders([]);
              setCurrentPrices(marketData);
            }}
            className="flex items-center space-x-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </Button>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Balance</p>
              <p className="text-2xl font-bold">${balance.toLocaleString()}</p>
            </div>
            <Wallet className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Portfolio Value</p>
              <p className="text-2xl font-bold">${totalPortfolioValue.toLocaleString()}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-secondary" />
          </div>
        </Card>
        <Card className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total P&L</p>
              <p className={`text-2xl font-bold ${totalPnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                ${totalPnl >= 0 ? '+' : ''}{totalPnl.toFixed(2)}
              </p>
            </div>
            {totalPnl >= 0 ? (
              <TrendingUp className="h-8 w-8 text-success" />
            ) : (
              <TrendingDown className="h-8 w-8 text-destructive" />
            )}
          </div>
        </Card>
        <Card className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">P&L %</p>
              <p className={`text-2xl font-bold ${totalPnlPercent >= 0 ? 'text-success' : 'text-destructive'}`}>
                {totalPnlPercent >= 0 ? '+' : ''}{totalPnlPercent.toFixed(2)}%
              </p>
            </div>
            <Target className="h-8 w-8 text-warning" />
          </div>
        </Card>
      </div>

      <Tabs defaultValue="trading" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trading">Trading</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        {/* Trading Tab */}
        <TabsContent value="trading" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Form */}
            <Card className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4">Place Order</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="symbol">Symbol</Label>
                    <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(marketData).map(symbol => (
                          <SelectItem key={symbol} value={symbol}>
                            {symbol}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="side">Side</Label>
                    <Select value={orderSide} onValueChange={(value: 'buy' | 'sell') => setOrderSide(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buy">Buy</SelectItem>
                        <SelectItem value="sell">Sell</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={orderQuantity}
                      onChange={(e) => setOrderQuantity(Number(e.target.value))}
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Order Type</Label>
                    <Select value={orderType} onValueChange={(value: 'market' | 'limit' | 'stop') => setOrderType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="market">Market</SelectItem>
                        <SelectItem value="limit">Limit</SelectItem>
                        <SelectItem value="stop">Stop</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {orderType !== 'market' && (
                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={orderPrice}
                      onChange={(e) => setOrderPrice(Number(e.target.value))}
                    />
                  </div>
                )}

                <Button onClick={placeOrder} className="w-full">
                  Place {orderSide === 'buy' ? 'Buy' : 'Sell'} Order
                </Button>
              </div>
            </Card>

            {/* Market Data */}
            <Card className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4">Market Data</h3>
              <div className="space-y-3">
                {Object.entries(currentPrices).map(([symbol, data]) => (
                  <div key={symbol} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold">{symbol}</span>
                      <Badge variant={data.change >= 0 ? "default" : "destructive"}>
                        {data.change >= 0 ? '+' : ''}{data.changePercent.toFixed(2)}%
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${data.price.toFixed(2)}</p>
                      <p className={`text-sm ${data.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {data.change >= 0 ? '+' : ''}${data.change.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Positions Tab */}
        <TabsContent value="positions" className="space-y-4">
          <Card className="glass-card">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Current Positions</h3>
              {positions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No open positions</p>
              ) : (
                <div className="space-y-3">
                  {positions.map(position => (
                    <div key={position.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-semibold">{position.symbol}</p>
                          <p className="text-sm text-muted-foreground">
                            {position.side === 'long' ? 'Long' : 'Short'} • {position.quantity} shares
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${position.currentPrice.toFixed(2)}</p>
                        <p className={`text-sm ${position.pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)} ({position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%)
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-4">
          <Card className="glass-card">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Order History</h3>
              {orders.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No orders placed</p>
              ) : (
                <div className="space-y-3">
                  {orders.map(order => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-semibold">{order.symbol}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.side.toUpperCase()} • {order.quantity} shares • {order.type}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${order.price.toFixed(2)}</p>
                        <Badge variant={order.status === 'filled' ? 'default' : 'secondary'}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TradingSimulator;



