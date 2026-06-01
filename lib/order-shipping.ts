import { estimateCartTotals } from "@/lib/cart-totals";
import {
  getShippingConfig,
  getTaxConfig,
  type ShippingMethodConfig,
} from "@/lib/store-config";
import type { ValidatedCartLine } from "@/types/cart-validation";

export type WooOrderShippingLine = {
  method_id: string;
  method_title: string;
  total: string;
  meta_data?: { key: string; value: string }[];
};

function formatLineTotal(amount: number): string {
  return amount.toFixed(2);
}

function withInstanceMeta(
  method: ShippingMethodConfig,
  line: WooOrderShippingLine,
): WooOrderShippingLine {
  if (method.instanceId <= 0) {
    return line;
  }

  return {
    ...line,
    meta_data: [
      {
        key: "instance_id",
        value: String(method.instanceId),
      },
    ],
  };
}

export async function buildOrderShippingLines(
  lines: ValidatedCartLine[],
): Promise<WooOrderShippingLine[]> {
  const [shippingConfig, taxConfig] = await Promise.all([
    getShippingConfig(),
    getTaxConfig(),
  ]);

  const totals = estimateCartTotals(lines, shippingConfig, taxConfig);

  if (totals.qualifiesForFreeShipping && shippingConfig.freeShippingMethod) {
    return [
      withInstanceMeta(shippingConfig.freeShippingMethod, {
        method_id: shippingConfig.freeShippingMethod.methodId,
        method_title: shippingConfig.freeShippingMethod.methodTitle,
        total: "0.00",
      }),
    ];
  }

  if (shippingConfig.flatRateMethod) {
    return [
      withInstanceMeta(shippingConfig.flatRateMethod, {
        method_id: shippingConfig.flatRateMethod.methodId,
        method_title: shippingConfig.flatRateMethod.methodTitle,
        total: formatLineTotal(totals.shippingTotal),
      }),
    ];
  }

  return [
    {
      method_id: "flat_rate",
      method_title: "Shipping",
      total: formatLineTotal(totals.shippingTotal),
    },
  ];
}
