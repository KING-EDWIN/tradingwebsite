const { sql } = require('@vercel/postgres');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const { user_id } = req.query;

      if (!user_id) {
        return res.status(400).json({
          success: false,
          error: 'User ID is required'
        });
      }

      // Get user's portfolio with current market prices
      const result = await sql`
        SELECT 
          p.*,
          m.price as current_price,
          (m.price * p.quantity) as total_value,
          ((m.price - p.average_price) * p.quantity) as profit_loss,
          (((m.price - p.average_price) / p.average_price) * 100) as profit_loss_percent
        FROM portfolio p
        LEFT JOIN market_data m ON p.symbol = m.symbol
        WHERE p.user_id = ${user_id} AND p.quantity > 0
        ORDER BY p.updated_at DESC
      `;

      // Calculate total portfolio value
      const totalValue = result.rows.reduce((sum, row) => {
        return sum + (parseFloat(row.current_price || 0) * parseFloat(row.quantity));
      }, 0);

      const totalProfitLoss = result.rows.reduce((sum, row) => {
        return sum + parseFloat(row.profit_loss || 0);
      }, 0);

      res.status(200).json({
        success: true,
        data: result.rows.map(row => ({
          id: row.id,
          symbol: row.symbol,
          quantity: parseFloat(row.quantity),
          average_price: parseFloat(row.average_price),
          current_price: parseFloat(row.current_price || 0),
          total_value: parseFloat(row.total_value || 0),
          profit_loss: parseFloat(row.profit_loss || 0),
          profit_loss_percent: parseFloat(row.profit_loss_percent || 0),
          updated_at: row.updated_at
        })),
        summary: {
          total_value: totalValue,
          total_profit_loss: totalProfitLoss,
          total_profit_loss_percent: totalValue > 0 ? (totalProfitLoss / (totalValue - totalProfitLoss)) * 100 : 0
        }
      });
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch portfolio',
        details: error.message
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
