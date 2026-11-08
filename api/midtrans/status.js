export default async function handler(req, res) {
  try {
    const orderId = (req.query?.orderId || '').trim();
    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    const serverKey = (process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-H~~nBHvGv50Z1VrGQfLnaFPu').trim();
    const isProd = process.env.MIDTRANS_IS_PRODUCTION === 'true';
    const apiHost = isProd ? 'api.midtrans.com' : 'api.sandbox.midtrans.com';
    const auth = Buffer.from(`${serverKey}:`).toString('base64');

    const midtransRes = await fetch(`https://${apiHost}/v2/${encodeURIComponent(orderId)}/status`, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
      },
    });

    const json = await midtransRes.json();
    return res.status(midtransRes.status).json(json);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

