import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

async function checkProducts() {
  try {
    // List all products
    const products = await stripe.products.list({ limit: 10 })

    console.log('\n📦 Your Stripe Products:\n')

    for (const product of products.data) {
      console.log(`\nProduct: ${product.name}`)
      console.log(`  ID: ${product.id}`)

      // Get prices for this product
      const prices = await stripe.prices.list({
        product: product.id,
        limit: 10
      })

      if (prices.data.length > 0) {
        console.log('  Prices:')
        for (const price of prices.data) {
          const amount = price.unit_amount ? `$${(price.unit_amount / 100).toFixed(2)}` : 'N/A'
          const interval = price.recurring ? `/${price.recurring.interval}` : 'one-time'
          console.log(`    - ${amount}${interval} (ID: ${price.id})`)
        }
      }
    }

  } catch (error) {
    console.error('Error:', error)
  }
}

checkProducts()
