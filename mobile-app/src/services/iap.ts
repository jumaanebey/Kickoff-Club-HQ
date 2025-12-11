import { addCoins } from './supabase';

export interface IAPPackage {
    id: string;
    kpAmount: number;
    priceUSD: string;
    bonusPercent?: number;
    isFeatured?: boolean;
    icon: string;
}

const PACKAGES: IAPPackage[] = [
    {
        id: 'kp_small',
        kpAmount: 500,
        priceUSD: '$4.99',
        icon: 'coins',
    },
    {
        id: 'kp_medium',
        kpAmount: 1200,
        priceUSD: '$9.99',
        bonusPercent: 20,
        isFeatured: true,
        icon: 'coins',
    },
    {
        id: 'kp_large',
        kpAmount: 3000,
        priceUSD: '$19.99',
        bonusPercent: 50,
        icon: 'coins',
    },
    {
        id: 'kp_mega',
        kpAmount: 10000,
        priceUSD: '$49.99',
        bonusPercent: 100,
        icon: 'crown',
    },
];

export const getPackages = async (): Promise<IAPPackage[]> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return PACKAGES;
};

export const purchasePackage = async (userId: string, packageId: string): Promise<void> => {
    // Simulate network delay and processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const pkg = PACKAGES.find((p) => p.id === packageId);
    if (!pkg) {
        throw new Error('Invalid package');
    }

    // Add coins to user
    await addCoins(userId, pkg.kpAmount, `IAP: ${pkg.id}`);
};
