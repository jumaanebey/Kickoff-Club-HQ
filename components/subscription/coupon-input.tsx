'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, XCircle, Tag } from 'lucide-react'

interface CouponInputProps {
  onCouponApplied: (coupon: any) => void
  onCouponRemoved: () => void
}

export function CouponInput({ onCouponApplied, onCouponRemoved }: CouponInputProps) {
  const [couponCode, setCouponCode] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [error, setError] = useState('')

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return

    setIsValidating(true)
    setError('')

    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode })
      })

      const data = await response.json()

      if (data.valid) {
        setAppliedCoupon(data.coupon)
        onCouponApplied(data.coupon)
        setCouponCode('')
      } else {
        setError(data.error || 'Invalid coupon code')
      }
    } catch (err) {
      setError('Failed to validate coupon')
    } finally {
      setIsValidating(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setError('')
    onCouponRemoved()
  }

  if (appliedCoupon) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-semibold text-green-900">
                  Coupon Applied: {appliedCoupon.code}
                </div>
                <div className="text-sm text-green-700">
                  {appliedCoupon.discount_type === 'percentage'
                    ? `${appliedCoupon.discount_value}% off`
                    : `$${appliedCoupon.discount_value} off`
                  }
                  {appliedCoupon.description && ` - ${appliedCoupon.description}`}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveCoupon}
              className="text-green-700 hover:text-green-900"
            >
              Remove
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="coupon" className="flex items-center gap-2">
        <Tag className="h-4 w-4" />
        Have a coupon code?
      </Label>
      <div className="flex gap-2">
        <Input
          id="coupon"
          type="text"
          placeholder="Enter code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
          disabled={isValidating}
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleApplyCoupon}
          disabled={isValidating || !couponCode.trim()}
        >
          {isValidating ? 'Validating...' : 'Apply'}
        </Button>
      </div>
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <XCircle className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  )
}
