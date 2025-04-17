import Stripe from "stripe";

export type StripePriceList = {
  object: "list";
  data: StripePrice[];
  has_more: boolean;
  url: string;
};

export type StripePrice = {
  id: string;
  object: "price";
  active: boolean;
  billing_scheme: "per_unit" | "tiered";
  created: number;
  currency: string;
  custom_unit_amount: null | unknown;
  livemode: boolean;
  lookup_key: string | null;
  metadata: Record<string, string>;
  nickname: string | null;
  product: StripeProduct; // produto expandido
  recurring: {
    interval: "day" | "week" | "month" | "year";
    interval_count: number;
    meter: null | unknown;
    trial_period_days: number | null;
    usage_type: "licensed" | "metered";
  };
  tax_behavior: "inclusive" | "exclusive" | "unspecified";
  tiers_mode: null | "graduated" | "volume";
  transform_quantity: null | unknown;
  type: "recurring" | "one_time";
  unit_amount: number;
  unit_amount_decimal: string;
};

export type StripeProduct = {
  id: string;
  object: "product";
  active: boolean;
  attributes: string[];
  created: number;
  default_price: string;
  description: string | null;
  images: string[];
  livemode: boolean;
  marketing_features: any[];
  metadata: Record<string, string>;
  name: string;
  package_dimensions: null | unknown;
  shippable: null | boolean;
  statement_descriptor: string | null;
  tax_code: string | null;
  type: "good" | "service";
  unit_label: string | null;
  updated: number;
  url: string | null;
};

export type CheckoutResponseSuccess = {
  id: string;
  client_secret: string;
  error: null;
};

export type CheckoutResponseError = {
  error: string;
};

export type CheckoutResponse = CheckoutResponseSuccess | CheckoutResponseError;
