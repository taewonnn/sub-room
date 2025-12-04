// 결제 주기
export type BillingCycle = "monthly" | "yearly" | "one-time";

// 카테고리
export type SubscriptionCategory = "OTT" | "VPN" | "COURSE" | "OTHER";

export interface Subscription {
  id: string; // ID
  user_id: string; // 사용자 ID
  name: string; // 이름
  price: number; // 가격
  billing_cycle: BillingCycle; // 결제 주기
  category: SubscriptionCategory; // 카테고리
  currency: string; // 통화
  payment_method: string; // 결제 방법
  memo?: string; // 메모
  is_active: boolean; // 활성 여부
  created_at: string; // 생성 날짜
  updated_at: string; // 수정 날짜
}


export interface SubscriptionInsert {
  name: string;
  price: number;
  billing_cycle: BillingCycle;
  next_billing_date: string;
  category?: SubscriptionCategory;
  currency?: string;
  payment_method?: string;
  memo?: string;
  is_active?: boolean;
}

export interface SubscriptionUpdate {
  name?: string;
  price?: number;
  billing_cycle?: BillingCycle;
  next_billing_date?: string;
  category?: SubscriptionCategory;
  currency?: string;
  payment_method?: string;
  memo?: string;
  is_active?: boolean;
}