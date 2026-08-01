export type PlanTier = "free" | "pro";
export type SubscriptionStatus = "active" | "past_due" | "canceled" | "paused" | null;
export type UserRole = "owner" | "brewer" | "admin";
export type ApprovalStatus = "pending" | "approved" | "rejected";
export type VerificationStatus = "unverified" | "pending" | "approved" | "rejected";

export interface Profile {
  id: string;
  email: string;
  brewery_name: string | null;
  role: UserRole;
  brewery_id: string | null;
  invited_by: string | null;
  created_at: string;
  paddle_customer_id: string | null;
  paddle_subscription_id: string | null;
  plan_tier: PlanTier;
  paddle_price_id: string | null;
  subscription_status: SubscriptionStatus;
  approval_status: ApprovalStatus;
  verification_status: VerificationStatus;
  last_login: string | null;
}

export interface Batch {
  id: string;
  user_id: string;
  date: string;
  beer_name: string;
  batch_number: number;
  og: number | null;
  fg: number | null;
  abv: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type BatchInsert = Omit<
  Batch,
  "id" | "user_id" | "created_at" | "updated_at"
>;

export type BatchUpdate = Partial<BatchInsert>;

export interface BatchFormData {
  date: string;
  beer_name: string;
  batch_number: number;
  og: string;
  fg: string;
  notes: string;
}

// Inventory types — added without modifying existing types
export type IngredientType = "malt" | "hops" | "yeast" | "other";

export interface Ingredient {
  id: string;
  user_id: string;
  name: string;
  type: IngredientType;
  quantity: number;
  unit: string;
  reorder_level: number;
  created_at: string;
  updated_at: string;
}

export interface BatchIngredient {
  id: string;
  batch_id: string;
  ingredient_id: string;
  quantity_used: number;
  created_at: string;
  ingredient?: Ingredient;
}

export interface BatchIngredientWithName extends BatchIngredient {
  ingredient_name: string;
  ingredient_type: IngredientType;
  ingredient_unit: string;
}

// Analysis types
export interface BatchAnalysis {
  id: string;
  brewery_id: string;
  triggered_by: string;
  batch_count: number;
  summary: string;
  trends: Record<string, unknown> | null;
  raw_response: string | null;
  created_at: string;
}

export interface AnalysisResult {
  trends: string[];
  outliers: string[];
  summary: string;
}

// Recipe types
export interface Recipe {
  id: string;
  user_id: string;
  name: string;
  style: string | null;
  malt_bill: string | null;
  hop_schedule: string | null;
  yeast: string | null;
  target_og: number | null;
  target_fg: number | null;
  target_abv: number | null;
  target_ibu: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Verification types
export interface Verification {
  id: string;
  user_id: string;
  company_name: string;
  company_number: string;
  business_type: string;
  documents: string[];
  status: VerificationStatus;
  admin_notes: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

// Subscription types
export interface Subscription {
  id: string;
  user_id: string;
  plan_tier: PlanTier;
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
  paddle_subscription_id: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

// Audit log types
export interface AuditLog {
  id: string;
  actor_id: string | null;
  action: string;
  target_id: string | null;
  target_type: string;
  metadata: Record<string, unknown>;
  ip: string | null;
  created_at: string;
}
