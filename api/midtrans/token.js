export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const serverKey = (process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-H~~nBHvGv50Z1VrGQfLnaFPu').trim();
    const isProd = process.env.MIDTRANS_IS_PRODUCTION === 'true';
    const host = isProd ? 'app.midtrans.com' : 'app.sandbox.midtrans.com';
    const auth = Buffer.from(`${serverKey}:`).toString('base64');

    const orderId = String(data.orderId || `SKY-${Date.now()}`);
    const grossAmount = Math.round(Number(data.grossAmount) || 0);

    const payload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      customer_details: {
        first_name: data.customer?.fullName || 'Pelanggan Sky Furniture',
        email: data.customer?.email || 'customer@skyfurniture.com',
        phone: data.customer?.phone || '081234567890',
        billing_address: {
          address: data.customer?.address || '',
          city: data.customer?.city || '',
          postal_code: data.customer?.postalCode || '',
        },
      },
    };

    if (Array.isArray(data.items) && data.items.length > 0) {
      const items = data.items.map(i => ({
        id: String(i.productId || i.id || 'item').slice(0, 50),
        price: Math.round(Number(i.unit || i.price || 0)),
        quantity: Math.max(1, Number(i.qty || i.quantity || 1)),
        name: String(i.name || 'Produk').slice(0, 50),
      }));
      const sumItems = items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
      if (sumItems === grossAmount) {
        payload.item_details = items;
      }
    }

    const mapPaymentMethod = (pm) => {
      if (!pm) return null;
      const key = String(pm).toLowerCase().trim();
      switch (key) {
        case 'bca':
        case 'bca_va':
          return ['bca_va'];
        case 'mandiri':
        case 'echannel':
        case 'mandiri_va':
          return ['echannel'];
        case 'bni':
        case 'bni_va':
          return ['bni_va'];
        case 'bri':
        case 'bri_va':
          return ['bri_va'];
        case 'permata':
        case 'permata_va':
          return ['permata_va'];
        case 'gopay':
          return ['gopay'];
        case 'shopeepay':
          return ['shopeepay'];
        case 'ovo':
        case 'qris':
          return ['gopay', 'shopeepay'];
        case 'cicilan':
        case 'credit_card':
        case 'kartu':
          return ['credit_card'];
        default:
          return null;
      }
    };

    const enabled = Array.isArray(data.enabledPayments) && data.enabledPayments.length > 0
      ? data.enabledPayments
      : mapPaymentMethod(data.paymentMethod || data.paymentId);

    if (enabled && enabled.length > 0) {
      payload.enabled_payments = enabled;
    }

    const midtransRes = await fetch(`https://${host}/snap/v1/transactions`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const json = await midtransRes.json();
    return res.status(midtransRes.status).json(json);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

