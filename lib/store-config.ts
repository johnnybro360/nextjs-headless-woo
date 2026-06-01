import { wooFetch } from "@/lib/woo-fetch";

export type ShippingMethodConfig = {
  methodId: string;
  instanceId: number;
  methodTitle: string;
  minAmount?: number;
  cost?: number;
};

export type ShippingConfig = {
  freeShippingMin: number | null;
  flatRateCost: number | null;
  flatRateMethod: ShippingMethodConfig | null;
  freeShippingMethod: ShippingMethodConfig | null;
};

export type TaxConfig = {
  pricesIncludeTax: boolean;
  gstRate: number;
};

type WooShippingZone = {
  id: number;
  name: string;
};

type WooShippingMethod = {
  id: number;
  method_id: string;
  title: string;
  enabled: boolean;
  settings: Record<string, { value?: string }>;
};

type WooTax = {
  country: string;
  rate: string;
  shipping: boolean;
};

type WooSetting = {
  id: string;
  value: string;
};

const DEFAULT_FREE_SHIPPING_MIN = Number(
  process.env.FREE_SHIPPING_THRESHOLD ?? "50",
);
const DEFAULT_FLAT_RATE = Number(process.env.FLAT_RATE_SHIPPING_COST ?? "10");
const DEFAULT_GST_RATE = Number(process.env.GST_RATE ?? "0.1");

function parseSettingAmount(
  settings: Record<string, { value?: string }>,
  key: string,
): number | null {
  const raw = settings[key]?.value;
  if (raw === undefined || raw === "") {
    return null;
  }
  const amount = Number.parseFloat(raw);
  return Number.isFinite(amount) ? amount : null;
}

function pickLowerMinAmount(
  current: number | null,
  candidate: number | null,
): number | null {
  if (candidate === null) {
    return current;
  }
  if (current === null) {
    return candidate;
  }
  return Math.min(current, candidate);
}

function pickLowerCost(
  current: ShippingMethodConfig | null,
  candidate: ShippingMethodConfig,
): ShippingMethodConfig {
  if (!current || (candidate.cost ?? Infinity) < (current.cost ?? Infinity)) {
    return candidate;
  }
  return current;
}

export async function getShippingConfig(): Promise<ShippingConfig> {
  try {
    const { data: zones } = await wooFetch<WooShippingZone[]>("/shipping/zones");
    const zoneIds = [
      0,
      ...zones.map((zone) => zone.id).filter((id) => id !== 0),
    ];

    let freeShippingMin: number | null = null;
    let flatRateCost: number | null = null;
    let flatRateMethod: ShippingMethodConfig | null = null;
    let freeShippingMethod: ShippingMethodConfig | null = null;

    for (const zoneId of zoneIds) {
      const { data: methods } = await wooFetch<WooShippingMethod[]>(
        `/shipping/zones/${zoneId}/methods`,
      );

      for (const method of methods) {
        if (!method.enabled) {
          continue;
        }

        if (method.method_id === "free_shipping") {
          const min = parseSettingAmount(method.settings, "min_amount");
          freeShippingMin = pickLowerMinAmount(freeShippingMin, min);

          const config: ShippingMethodConfig = {
            methodId: "free_shipping",
            instanceId: method.id,
            methodTitle: method.title || "Free shipping",
            minAmount: min ?? undefined,
          };

          if (
            !freeShippingMethod ||
            (min ?? Infinity) < (freeShippingMethod.minAmount ?? Infinity)
          ) {
            freeShippingMethod = config;
          }
        }

        if (method.method_id === "flat_rate") {
          const cost = parseSettingAmount(method.settings, "cost");
          flatRateCost = pickLowerMinAmount(flatRateCost, cost);

          const config: ShippingMethodConfig = {
            methodId: "flat_rate",
            instanceId: method.id,
            methodTitle: method.title || "Flat rate",
            cost: cost ?? undefined,
          };

          flatRateMethod = pickLowerCost(flatRateMethod, config);
        }
      }
    }

    return {
      freeShippingMin: freeShippingMin ?? DEFAULT_FREE_SHIPPING_MIN,
      flatRateCost: flatRateCost ?? DEFAULT_FLAT_RATE,
      flatRateMethod,
      freeShippingMethod,
    };
  } catch {
    return {
      freeShippingMin: DEFAULT_FREE_SHIPPING_MIN,
      flatRateCost: DEFAULT_FLAT_RATE,
      flatRateMethod: {
        methodId: "flat_rate",
        instanceId: 0,
        methodTitle: "Flat rate",
        cost: DEFAULT_FLAT_RATE,
      },
      freeShippingMethod: {
        methodId: "free_shipping",
        instanceId: 0,
        methodTitle: "Free shipping",
        minAmount: DEFAULT_FREE_SHIPPING_MIN,
      },
    };
  }
}

export async function getTaxConfig(): Promise<TaxConfig> {
  try {
    const { data: settings } = await wooFetch<WooSetting[]>("/settings/tax");
    const pricesIncludeTax =
      settings.find((s) => s.id === "woocommerce_prices_include_tax")?.value ===
      "yes";

    const { data: taxes } = await wooFetch<WooTax[]>("/taxes");
    const auRate = taxes.find((tax) => tax.country === "AU");
    const gstRate = auRate
      ? Number.parseFloat(auRate.rate) / 100
      : DEFAULT_GST_RATE;

    return {
      pricesIncludeTax,
      gstRate: Number.isFinite(gstRate) ? gstRate : DEFAULT_GST_RATE,
    };
  } catch {
    return {
      pricesIncludeTax: true,
      gstRate: DEFAULT_GST_RATE,
    };
  }
}
