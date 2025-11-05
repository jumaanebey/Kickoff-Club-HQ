import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/app/actions/auth'
import { validateCoupon, checkUserCouponUsage } from '@/lib/db/coupon-queries'

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json(
        { valid: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { code } = await request.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { valid: false, error: 'Coupon code is required' },
        { status: 400 }
      )
    }

    // Validate coupon
    const validation = await validateCoupon(code)

    if (!validation.valid) {
      return NextResponse.json(validation, { status: 200 })
    }

    // Check if user already used this coupon
    const alreadyUsed = await checkUserCouponUsage(user.id, validation.coupon.id)

    if (alreadyUsed) {
      return NextResponse.json(
        { valid: false, error: 'You have already used this coupon' },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { valid: true, coupon: validation.coupon },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error validating coupon:', error)
    return NextResponse.json(
      { valid: false, error: 'Failed to validate coupon' },
      { status: 500 }
    )
  }
}
