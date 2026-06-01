# Headless WooCommerce — roadmap

Launch target: **Australia only · simple products · Stripe (via WooCommerce `payment_url`)**

---

## What’s already built

| Area | Status |
|------|--------|
| **Catalog** | Shop with WC-backed filters, sort, search, pagination |
| **Product detail** | PDP, images, tabs, JSON-LD, related products |
| **Cart** | Zustand + `localStorage`; server validation via `validateCart` / `getCartTotals` |
| **Checkout** | AU-only form (state select, 4-digit postcode), Zod, WC order creation |
| **Cart totals** | Subtotal, shipping, GST estimate from WC zones + tax settings (`lib/store-config.ts`) |
| **Payments (code)** | `payment_method: stripe`, redirect to `payment_url` when present |
| **SEO** | Metadata, sitemaps, `/product/{slug}` URLs |
| **CMS pages** | `/about`, `/policy` from WordPress pages |
| **API layer** | OAuth `wooFetch`, `wpFetch`, mappers, server actions |

---

## Launch blockers (remaining)

### 1. Stripe on WordPress (store config)

- [ ] Install **WooCommerce Stripe Payment Gateway**
- [ ] Currency **AUD**; test → live keys
- [ ] End-to-end: order → Stripe redirect → paid in WP → email

### 2. WooCommerce admin — shipping & GST

Configure in WP so API totals match estimates:

- [ ] **WooCommerce → Settings → General**: store address Australia, currency AUD
- [ ] **WooCommerce → Settings → Tax**: enable tax, GST rate 10%, note if prices include tax
- [ ] **WooCommerce → Settings → Shipping → Zones**: Australia zone
  - Flat rate (e.g. $10) or local pickup
  - Free shipping method with minimum order amount (e.g. $50)
- [ ] Optional env fallbacks: `FREE_SHIPPING_THRESHOLD`, `FLAT_RATE_SHIPPING_COST`, `GST_RATE`

### 3. Full path test

- [ ] Browse → add to cart → cart shows WC prices + estimate
- [ ] Checkout (AU address) → place order → Stripe → paid
- [ ] Confirmation email; stock decrements in WP

### 4. SSL & production host

- [ ] Valid HTTPS on WordPress host (or dev `WC_URL` over HTTP)
- [ ] Production env on Vercel: `WC_URL`, `WC_KEY`, `WC_SECRET`, `PROD_URL`

---

## Post-launch / optional

| Item | Notes |
|------|--------|
| **Variable products** | PDP/cart/orders need `variation_id` |
| **Customer accounts** | Login, order history |
| **Webhooks** | Revalidate product cache on stock/price change |
| **Coupons / reviews** | Not implemented |
| **Footer placeholders** | Wire to WP pages or remove |
| **Tests** | No e2e yet |

---

## v1 definition of done

- [x] Shop + PDP for simple products
- [x] Cart validated against WC (`lib/cart-validation.ts`, `lib/cart-actions.ts`)
- [x] Checkout AU only + server re-validation on submit
- [x] Cart/checkout WC-backed total **estimates**; order returns WC **final** totals
- [x] Stripe redirect via `payment_url` *(WP plugin required)*
- [ ] Confirmation email *(WP mail)*
- [x] Sitemap / CMS pages

---

## Key files

| Purpose | File |
|---------|------|
| Validate cart | `lib/cart-validation.ts`, `lib/cart-actions.ts` |
| Shipping / GST config | `lib/store-config.ts`, `lib/cart-totals.ts` |
| AU address rules | `lib/au-address.ts`, `lib/checkout-schema.ts` |
| Create order | `lib/orders.ts` |
| Client hook | `hooks/use-validated-cart.ts` |
| UI | `components/cart/order-totals-breakdown.tsx` |

---

## Env checklist

```env
WC_URL=https://your-store.com
WC_KEY=ck_...
WC_SECRET=cs_...
PROD_URL=https://your-nextjs-site.vercel.app

WC_PAYMENT_METHOD=stripe
WC_PAYMENT_METHOD_TITLE=Credit Card (Stripe)
WP_PAGE_ABOUT_SLUG=about
WP_PAGE_POLICY_SLUG=privacy-policy

# Fallbacks if WC shipping/tax API unavailable
FREE_SHIPPING_THRESHOLD=50
FLAT_RATE_SHIPPING_COST=10
GST_RATE=0.1
```
