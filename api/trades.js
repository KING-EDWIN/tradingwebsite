const { sql } = require('@vercel/postgres');
const { v4: uuidv4 } = require('uuid');

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
      const { user_id } = req.query;

      if (!user_id) {
        return res.status(400).json({
          success: false,
          error: 'User ID is required'
        });
      }

      // Get user's trades
      const result = await sql`
        SELECT * FROM trades 
        WHERE user_id = ${user_id}
        ORDER BY created_at DESC
      `;

      res.status(200).json({
        success: true,
        data: result.rows.map(row => ({
          id: row.id,
          symbol: row.symbol,
          type: row.type,
          quantity: parseFloat(row.quantity),
          price: parseFloat(row.price),
          total_amount: parseFloat(row.total_amount),
          status: row.status,
          created_at: row.created_at,
          closed_at: row.closed_at
        }))
      });
    } catch (error) {
      console.error('Error fetching trades:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch trades',
        details: error.message
      });
    }
  } else if (req.method === 'POST') {
    try {
      const { user_id, symbol, type, quantity, price } = req.body;

      // Validate required fields
      if (!user_id || !symbol || !type || !quantity || !price) {
        return res.status(400).json({
          success: false,
          error: 'All fields are required'
        });
      }

      if (!['buy', 'sell'].includes(type)) {
        return res.status(400).json({
          success: false,
          error: 'Type must be either buy or sell'
        });
      }

      const total_amount = quantity * price;

      // Check user balance for buy orders
      if (type === 'buy') {
        const userResult = await sql`
          SELECT balance FROM users WHERE id = ${user_id}
        `;

        if (userResult.rows.length === 0) {
          return res.status(404).json({
            success: false,
            error: 'User not found'
          });
        }

        const userBalance = parseFloat(userResult.rows[0].balance);
        if (userBalance < total_amount) {
          return res.status(400).json({
            success: false,
            error: 'Insufficient balance'
          });
        }

        // Update user balance
        await sql`
          UPDATE users 
          SET balance = balance - ${total_amount}
          WHERE id = ${user_id}
        `;
      }

      // Create trade
      const tradeId = uuidv4();
      await sql`
        INSERT INTO trades (id, user_id, symbol, type, quantity, price, total_amount)
        VALUES (${tradeId}, ${user_id}, ${symbol}, ${type}, ${quantity}, ${price}, ${total_amount})
      `;

      // Update portfolio
      if (type === 'buy') {
        await sql`
          INSERT INTO portfolio (id, user_id, symbol, quantity, average_price)
          VALUES (gen_random_uuid(), ${user_id}, ${symbol}, ${quantity}, ${price})
          ON CONFLICT (user_id, symbol)
          DO UPDATE SET 
            quantity = portfolio.quantity + ${quantity},
            average_price = (portfolio.quantity * portfolio.average_price + ${total_amount}) / (portfolio.quantity + ${quantity}),
            updated_at = CURRENT_TIMESTAMP
        `;
      } else {
        // For sell orders, reduce quantity
        await sql`
          UPDATE portfolio 
          SET quantity = quantity - ${quantity},
              updated_at = CURRENT_TIMESTAMP
          WHERE user_id = ${user_id} AND symbol = ${symbol}
        `;

        // Add money back to balance
        await sql`
          UPDATE users 
          SET balance = balance + ${total_amount}
          WHERE id = ${user_id}
        `;
      }

      res.status(201).json({
        success: true,
        message: 'Trade executed successfully',
        trade: {
          id: tradeId,
          symbol,
          type,
          quantity: parseFloat(quantity),
          price: parseFloat(price),
          total_amount: parseFloat(total_amount),
          status: 'open'
        }
      });
    } catch (error) {
      console.error('Error creating trade:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create trade',
        details: error.message
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
