const { sql } = require('@vercel/postgres');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      // Get all market data
      const result = await sql`
        SELECT * FROM market_data 
        ORDER BY last_updated DESC
      `;

      res.status(200).json({
        success: true,
        data: result.rows.map(row => ({
          symbol: row.symbol,
          price: parseFloat(row.price),
          change_percent: parseFloat(row.change_percent || 0),
          volume: parseInt(row.volume || 0),
          market_cap: parseFloat(row.market_cap || 0),
          last_updated: row.last_updated
        }))
      });
    } catch (error) {
      console.error('Error fetching market data:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch market data',
        details: error.message
      });
    }
  } else if (req.method === 'POST') {
    try {
      const { symbol, price, change_percent, volume, market_cap } = req.body;

      if (!symbol || !price) {
        return res.status(400).json({
          success: false,
          error: 'Symbol and price are required'
        });
      }

      // Update or insert market data
      await sql`
        INSERT INTO market_data (id, symbol, price, change_percent, volume, market_cap)
        VALUES (gen_random_uuid(), ${symbol}, ${price}, ${change_percent || 0}, ${volume || 0}, ${market_cap || 0})
        ON CONFLICT (symbol) 
        DO UPDATE SET 
          price = EXCLUDED.price,
          change_percent = EXCLUDED.change_percent,
          volume = EXCLUDED.volume,
          market_cap = EXCLUDED.market_cap,
          last_updated = CURRENT_TIMESTAMP
      `;

      res.status(200).json({
        success: true,
        message: 'Market data updated successfully'
      });
    } catch (error) {
      console.error('Error updating market data:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update market data',
        details: error.message
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
