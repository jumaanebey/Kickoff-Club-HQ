'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Coins, Zap, TrendingUp, Sparkles, Check, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useShopStore } from '../hooks/useShopStore'
import { HEAD_STARTS, UPGRADES, getUpgradeCost, HeadStartType, UpgradeType } from '../data/shop-items'
import { cn } from '@/shared/utils'

type ShopTab = 'headstarts' | 'upgrades'

interface ShopProps {
  isOpen: boolean
  onClose: () => void
}

export function Shop({ isOpen, onClose }: ShopProps) {
  const [activeTab, setActiveTab] = useState<ShopTab>('headstarts')
  const {
    totalCoins,
    selectedHeadStarts,
    upgrades,
    toggleHeadStart,
    purchaseUpgrade,
    getHeadStartCost,
  } = useShopStore()

  const headStartCost = getHeadStartCost()

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-slate-900 border-2 border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl" />

          {/* Header */}
          <div className="relative p-6 pb-4 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                Shop
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Coin Balance */}
            <div className="mt-3 flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-xl w-fit border border-yellow-500/20">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="text-xl font-black text-yellow-400">
                {totalCoins.toLocaleString()}
              </span>
            </div>

            {/* Tab Switcher */}
            <div className="flex gap-2 mt-4">
              <TabButton
                active={activeTab === 'headstarts'}
                onClick={() => setActiveTab('headstarts')}
                icon={<Zap className="w-4 h-4" />}
              >
                Head Starts
              </TabButton>
              <TabButton
                active={activeTab === 'upgrades'}
                onClick={() => setActiveTab('upgrades')}
                icon={<TrendingUp className="w-4 h-4" />}
              >
                Upgrades
              </TabButton>
            </div>
          </div>

          {/* Content */}
          <div className="relative p-6 max-h-[400px] overflow-y-auto">
            {activeTab === 'headstarts' && (
              <HeadStartsTab
                totalCoins={totalCoins}
                selectedHeadStarts={selectedHeadStarts}
                onToggle={toggleHeadStart}
                currentCost={headStartCost}
              />
            )}
            {activeTab === 'upgrades' && (
              <UpgradesTab
                totalCoins={totalCoins}
                upgradeLevels={upgrades}
                onPurchase={purchaseUpgrade}
              />
            )}
          </div>

          {/* Footer */}
          {activeTab === 'headstarts' && headStartCost > 0 && (
            <div className="relative p-4 border-t border-slate-700/50 bg-slate-800/30">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-400">
                  Selected cost: <span className="text-yellow-400 font-bold">{headStartCost}</span> coins
                </div>
                <div className={cn(
                  "text-sm font-bold",
                  totalCoins >= headStartCost ? "text-green-400" : "text-red-400"
                )}>
                  {totalCoins >= headStartCost ? "Ready to play!" : "Not enough coins"}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Tab Button Component
function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all",
        active
          ? "bg-yellow-400 text-black"
          : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
      )}
    >
      {icon}
      {children}
    </button>
  )
}

// Head Starts Tab
function HeadStartsTab({
  totalCoins,
  selectedHeadStarts,
  onToggle,
  currentCost,
}: {
  totalCoins: number
  selectedHeadStarts: Record<HeadStartType, boolean>
  onToggle: (type: HeadStartType) => boolean
  currentCost: number
}) {
  return (
    <div className="space-y-3">
      <p className="text-slate-400 text-sm mb-4">
        Select powerups to start your next run with. Coins are spent when you play.
      </p>
      {HEAD_STARTS.map((item) => {
        const isSelected = selectedHeadStarts[item.id]
        const wouldExceedBudget = !isSelected && (currentCost + item.cost > totalCoins)
        const canAfford = isSelected || !wouldExceedBudget

        return (
          <button
            key={item.id}
            onClick={() => onToggle(item.id)}
            disabled={!canAfford && !isSelected}
            className={cn(
              "w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4",
              isSelected
                ? "bg-yellow-400/10 border-yellow-400 ring-2 ring-yellow-400/30"
                : canAfford
                  ? "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                  : "bg-slate-800/30 border-slate-700/50 opacity-50 cursor-not-allowed"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center text-2xl",
              isSelected ? "bg-yellow-400/20" : "bg-slate-700/50"
            )}>
              {item.icon}
            </div>
            <div className="flex-1 text-left">
              <div className="font-bold text-white">{item.name}</div>
              <div className="text-sm text-slate-400">{item.description}</div>
            </div>
            <div className="flex flex-col items-end gap-1">
              {isSelected ? (
                <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
                  <Check className="w-5 h-5 text-black" />
                </div>
              ) : (
                <div className="flex items-center gap-1 text-yellow-400 font-bold">
                  <Coins className="w-4 h-4" />
                  {item.cost}
                </div>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}

// Upgrades Tab
function UpgradesTab({
  totalCoins,
  upgradeLevels,
  onPurchase,
}: {
  totalCoins: number
  upgradeLevels: Record<UpgradeType, number>
  onPurchase: (type: UpgradeType) => boolean
}) {
  return (
    <div className="space-y-3">
      <p className="text-slate-400 text-sm mb-4">
        Permanent upgrades that boost every run. Purchase with coins.
      </p>
      {UPGRADES.map((upgrade) => {
        const currentLevel = upgradeLevels[upgrade.id]
        const isMaxed = currentLevel >= upgrade.maxLevel
        const nextCost = getUpgradeCost(upgrade.id, currentLevel)
        const canAfford = nextCost !== null && totalCoins >= nextCost

        return (
          <div
            key={upgrade.id}
            className="w-full p-4 rounded-2xl bg-slate-800/50 border-2 border-slate-700"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center text-2xl">
                {upgrade.icon}
              </div>
              <div className="flex-1">
                <div className="font-bold text-white">{upgrade.name}</div>
                <div className="text-sm text-slate-400">{upgrade.effectPerLevel}</div>
              </div>
            </div>

            {/* Level Progress */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 flex gap-1">
                {Array.from({ length: upgrade.maxLevel }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex-1 h-2 rounded-full transition-colors",
                      i < currentLevel
                        ? "bg-yellow-400"
                        : "bg-slate-700"
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-400 font-bold min-w-[40px] text-right">
                Lv.{currentLevel}/{upgrade.maxLevel}
              </span>
            </div>

            {/* Purchase Button */}
            <div className="mt-3">
              {isMaxed ? (
                <div className="flex items-center justify-center gap-2 py-2 text-green-400 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  MAXED OUT
                </div>
              ) : (
                <Button
                  onClick={() => onPurchase(upgrade.id)}
                  disabled={!canAfford}
                  className={cn(
                    "w-full font-bold",
                    canAfford
                      ? "bg-yellow-400 hover:bg-yellow-300 text-black"
                      : "bg-slate-700 text-slate-400 cursor-not-allowed"
                  )}
                >
                  <Coins className="w-4 h-4 mr-2" />
                  Upgrade for {nextCost?.toLocaleString()}
                </Button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
