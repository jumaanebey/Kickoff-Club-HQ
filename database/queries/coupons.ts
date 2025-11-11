// @ts-nocheck - Generated types may not match actual schema during build
import { supabase } from '../supabase'

// ========== COUPON VALIDATION ==========

export async function validateCoupon(code: string) {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single()

  if (error || !data) {
    return { valid: false, error: 'Invalid coupon code' }
  }

  const now = new Date()
  const validFrom = data.valid_from ? new Date(data.valid_from) : null
  const validUntil = data.valid_until ? new Date(data.valid_until) : null

  // Check date validity
  if (validFrom && now < validFrom) {
    return { valid: false, error: 'This coupon is not yet active' }
  }

  if (validUntil && now > validUntil) {
    return { valid: false, error: 'This coupon has expired' }
  }

  // Check usage limit
  if (data.max_uses !== null && data.uses_count >= data.max_uses) {
    return { valid: false, error: 'This coupon has reached its usage limit' }
  }

  return { valid: true, coupon: data }
}

export async function checkUserCouponUsage(userId: string, couponId: string) {
  const { data, error } = await supabase
    .from('coupon_redemptions')
    .select('id')
    .eq('user_id', userId)
    .eq('coupon_id', couponId)
    .single()

  if (error && error.code !== 'PGRST116') throw error // PGRST116 = not found
  return !!data
}

export async function calculateDiscount(
  amount: number,
  coupon: {
    discount_type: 'percentage' | 'fixed_amount'
    discount_value: number
  }
) {
  let discountAmount = 0

  if (coupon.discount_type === 'percentage') {
    discountAmount = (amount * coupon.discount_value) / 100
  } else {
    discountAmount = coupon.discount_value
  }

  // Ensure discount doesn't exceed original amount
  discountAmount = Math.min(discountAmount, amount)

  return {
    originalAmount: amount,
    discountAmount: Math.round(discountAmount * 100) / 100,
    finalAmount: Math.round((amount - discountAmount) * 100) / 100
  }
}

// ========== COUPON REDEMPTION ==========

export async function redeemCoupon(
  userId: string,
  couponId: string,
  subscriptionId?: string,
  discountAmount?: number
) {
  const { data, error } = await supabase
    .from('coupon_redemptions')
    .insert({
      user_id: userId,
      coupon_id: couponId,
      subscription_id: subscriptionId,
      discount_amount: discountAmount
    })
    .select()
    .single()

  if (error) throw error

  // Increment coupon usage count
  await supabase.rpc('increment_coupon_usage', { coupon_id: couponId })

  return data
}

export async function getUserCouponRedemptions(userId: string) {
  const { data, error } = await supabase
    .from('coupon_redemptions')
    .select(`
      *,
      coupons (
        code,
        discount_type,
        discount_value,
        description
      )
    `)
    .eq('user_id', userId)
    .order('redeemed_at', { ascending: false })

  if (error) throw error
  return data || []
}

// ========== ADMIN FUNCTIONS ==========

export async function createCoupon(couponData: {
  code: string
  discountType: 'percentage' | 'fixed_amount'
  discountValue: number
  description?: string
  validFrom?: string
  validUntil?: string
  maxUses?: number
  isActive: boolean
}) {
  const { data, error } = await supabase
    .from('coupons')
    .insert({
      code: couponData.code.toUpperCase(),
      discount_type: couponData.discountType,
      discount_value: couponData.discountValue,
      description: couponData.description,
      valid_from: couponData.validFrom,
      valid_until: couponData.validUntil,
      max_uses: couponData.maxUses,
      is_active: couponData.isActive,
      uses_count: 0
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateCoupon(
  couponId: string,
  updates: {
    isActive?: boolean
    description?: string
    validUntil?: string
    maxUses?: number
  }
) {
  const { data, error } = await supabase
    .from('coupons')
    .update({
      is_active: updates.isActive,
      description: updates.description,
      valid_until: updates.validUntil,
      max_uses: updates.maxUses
    })
    .eq('id', couponId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getAllCoupons() {
  const { data, error } = await supabase
    .from('coupons')
    .select(`
      *,
      coupon_redemptions (id)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getCouponStats(couponId: string) {
  const { data: redemptions, error } = await supabase
    .from('coupon_redemptions')
    .select('discount_amount')
    .eq('coupon_id', couponId)

  if (error) throw error

  const totalRedemptions = redemptions?.length || 0
  const totalDiscountGiven = redemptions?.reduce(
    (sum, r) => sum + (r.discount_amount || 0),
    0
  ) || 0

  return {
    totalRedemptions,
    totalDiscountGiven: Math.round(totalDiscountGiven * 100) / 100
  }
}

export async function deleteCoupon(couponId: string) {
  const { error } = await supabase
    .from('coupons')
    .delete()
    .eq('id', couponId)

  if (error) throw error
}
