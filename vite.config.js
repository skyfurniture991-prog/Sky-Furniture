import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      {
        name: 'midtrans-token-middleware',
        configureServer(server) {
          server.middlewares.use('/api/midtrans/token', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405
              return res.end(JSON.stringify({ error: 'Method Not Allowed' }))
            }
            let body = ''
            req.on('data', chunk => { body += chunk })
            req.on('end', async () => {
              try {
                const data = JSON.parse(body || '{}')
                const serverKey = (env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-H~~nBHvGv50Z1VrGQfLnaFPu').trim()
                const isProd = env.MIDTRANS_IS_PRODUCTION === 'true'
                const host = isProd ? 'app.midtrans.com' : 'app.sandbox.midtrans.com'
                const auth = Buffer.from(`${serverKey}:`).toString('base64')

                const orderId = String(data.orderId || `SKY-${Date.now()}`)
                const grossAmount = Math.round(Number(data.grossAmount) || 0)

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
                }

                if (Array.isArray(data.items) && data.items.length > 0) {
                  const items = data.items.map(i => ({
                    id: String(i.productId || i.id || 'item').slice(0, 50),
                    price: Math.round(Number(i.unit || i.price || 0)),
                    quantity: Math.max(1, Number(i.qty || i.quantity || 1)),
                    name: String(i.name || 'Produk').slice(0, 50),
                  }))
                  const sumItems = items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0)
                  if (sumItems === grossAmount) {
                    payload.item_details = items
                  }
                }

                // Map metode pembayaran Sky Furniture ke Midtrans enabled_payments
                // Jika hanya 1 metode (misal bca_va), Midtrans Snap akan langsung
                // membuka layar rincian pembayaran tersebut tanpa menampilkan popup pilihan menu lagi!
                const mapPaymentMethod = (pm) => {
                  if (!pm) return null
                  const key = String(pm).toLowerCase().trim()
                  switch (key) {
                    case 'bca':
                    case 'bca_va':
                      return ['bca_va']
                    case 'mandiri':
                    case 'echannel':
                    case 'mandiri_va':
                      return ['echannel']
                    case 'bni':
                    case 'bni_va':
                      return ['bni_va']
                    case 'bri':
                    case 'bri_va':
                      return ['bri_va']
                    case 'permata':
                    case 'permata_va':
                      return ['permata_va']
                    case 'gopay':
                      return ['gopay']
                    case 'shopeepay':
                      return ['shopeepay']
                    case 'ovo':
                      return ['gopay', 'shopeepay']
                    case 'qris':
                      return ['gopay', 'shopeepay']
                    case 'cicilan':
                    case 'credit_card':
                    case 'kartu':
                      return ['credit_card']
                    default:
                      return null
                  }
                }

                const enabled = Array.isArray(data.enabledPayments) && data.enabledPayments.length > 0
                  ? data.enabledPayments
                  : mapPaymentMethod(data.paymentMethod || data.paymentId)

                if (enabled && enabled.length > 0) {
                  payload.enabled_payments = enabled
                }

                const midtransRes = await fetch(`https://${host}/snap/v1/transactions`, {
                  method: 'POST',
                  headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                  },
                  body: JSON.stringify(payload),
                })

                const json = await midtransRes.json()
                res.setHeader('Content-Type', 'application/json')
                res.statusCode = midtransRes.status
                res.end(JSON.stringify(json))
              } catch (err) {
                res.setHeader('Content-Type', 'application/json')
                res.statusCode = 500
                res.end(JSON.stringify({ error: err.message }))
              }
            })
          })

          server.middlewares.use('/api/midtrans/status', async (req, res) => {
            try {
              const url = new URL(req.url, 'http://localhost')
              const orderId = (url.searchParams.get('orderId') || url.pathname.replace(/^\//, '')).trim()
              if (!orderId) {
                res.setHeader('Content-Type', 'application/json')
                res.statusCode = 400
                return res.end(JSON.stringify({ error: 'Order ID is required' }))
              }

              const serverKey = (env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-H~~nBHvGv50Z1VrGQfLnaFPu').trim()
              const isProd = env.MIDTRANS_IS_PRODUCTION === 'true'
              const apiHost = isProd ? 'api.midtrans.com' : 'api.sandbox.midtrans.com'
              const auth = Buffer.from(`${serverKey}:`).toString('base64')

              const midtransRes = await fetch(`https://${apiHost}/v2/${encodeURIComponent(orderId)}/status`, {
                headers: {
                  'Authorization': `Basic ${auth}`,
                  'Accept': 'application/json',
                },
              })

              const json = await midtransRes.json()
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = midtransRes.status
              res.end(JSON.stringify(json))
            } catch (err) {
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 500
              res.end(JSON.stringify({ error: err.message }))
            }
          })
        },
      },
    ],
    server: {
      proxy: {
        '/api/deploy': {
          target: 'https://api-cdn.deploy.com',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api\/deploy/, ''),
          secure: false,
        },
      },
    },
  }
})
