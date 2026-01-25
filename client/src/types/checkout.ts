export interface CartItem {
    id: string;
    title: string;
    price: number;
    originalPrice?: number;
    image?: string;
    isUpsell?: boolean;
    isGift?: boolean;
}

export interface CheckoutFormState {
    name: string;
    email: string;
    phone: string;
    password?: string;
    confirmPassword?: string;
    createAccount: boolean;
    isGift: boolean;
    agreedToTerms: boolean;
    // VAT Information
    requireVAT?: boolean;
    vatBuyerName?: string;
    vatCompanyName?: string;
    vatTaxId?: string;
    vatAddress?: string;
    vatEmail?: string;
    vatPhone?: string;
}

export type CheckoutStep = 'form' | 'payment';

export interface CheckoutState {
    step: CheckoutStep;
    cart: CartItem[];
    form: CheckoutFormState;
    payment: {
        orderId?: string;
        orderCode?: string;
        qrContent?: string;
        amount?: number;
        expiresAt?: number; // timestamp
        status: 'pending' | 'paid' | 'expired';
    };
}
