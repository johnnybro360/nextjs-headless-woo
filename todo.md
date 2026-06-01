# Headless WooCommerce — roadmap

Launch target: **Australia only · simple products · Stripe (via WooCommerce `payment_url`)**

**Status: v1 launch complete** — store config, payments, shipping/GST, and E2E flow verified.

---

## What’s built (v1)

| Area | Status |
|------|--------|
| **Catalog** | Shop with WC-backed filters, sort, search, pagination |
| **Product detail** | PDP, images, tabs, JSON-LD, related products |
| **Cart** | Zustand + `localStorage`; server validation via `validateCart` / `getCartTotals` |
| **Checkout** | AU-only form, Zod, WC order + `shipping_lines` |
| **Cart totals** | Subtotal, shipping, GST estimates from WC zones + tax |
| **Payments** | Stripe via `payment_url`; order total incl. shipping + GST |
| **SEO** | Metadata, sitemaps, `/product/{slug}` URLs |
| **CMS pages** | `/about`, `/policy` from WordPress |
| **API layer** | OAuth `wooFetch`, `wpFetch`, server actions |
| **Webhooks** | `POST /api/webhooks/woocommerce` → `revalidateTag` + `revalidatePath` on `product.*` |

---

## Launch checklist (done)

- [x] WooCommerce Stripe Payment Gateway — AUD, test/live keys
- [x] `WC_PAYMENT_METHOD=stripe` matches WP gateway
- [x] E2E: cart → checkout → Stripe total = products + shipping + GST
- [x] Orders paid in WP; confirmation email
- [x] WC General / Tax / Shipping (AU zone, flat rate, free shipping)
- [x] Full path test: validated cart, stock, WP order totals
- [x] Production: `WC_URL`, keys, `PROD_URL` on Vercel

---

## What’s next (recommended order)

### Phase A — Trust & polish (1–2 days)

Low effort, high impact before marketing the site.

| Priority | Task | Why |
|----------|------|-----|
| 1 | **Footer & CMS** | Wire or remove `#` links (Terms, FAQ, Shipping, Contact) → WP pages like `/about` |
| 2 | **Analytics** | GA4 or Plausible on Next.js layout |
| 3 | **Error monitoring** | Sentry (or similar) on checkout / `createOrder` failures |
| 4 | **Legal copy** | Finalise About + Privacy in WordPress; add Shipping/Returns page if needed |

### Phase B — Operations (when catalog changes often)

| Priority | Task | Why |
|----------|------|-----|
| 6 | **Guest order lookup** | Success page or `/order-status` — email + order number → fetch order from WC REST |
| 7 | **Abandoned orders** | Review pending/unpaid orders in WP; optional cleanup cron |

Configure WC webhooks in production — see README **Webhooks** section.

### Phase C — Growth features (pick by business need)

| Feature | Scope |
|---------|--------|
| **Coupons** | `coupon_lines` on create order + apply field on cart/checkout |
| **Reviews** | WC reviews API or Judge.me / etc. on PDP |
| **Mini-cart** | Drawer instead of redirect to `/cart` |
| **Customer accounts** | JWT or WP login plugin + `/account` orders & addresses |
| **Variable products** | Variation picker on PDP, `variation_id` in cart/orders *(only if catalog needs it)* |

### Phase D — Engineering hygiene

| Task | Notes |
|------|--------|
| **E2E tests** | Playwright: shop → cart → checkout (mock or Stripe test mode) |
| **README** | Replace create-next-app boilerplate with setup, env, deploy steps |
| **HTTPS on WP** | Move `WC_URL` to HTTPS when host cert is stable |

---

## v1 definition of done

- [x] Shop + PDP for simple products
- [x] Cart validated against WC
- [x] Checkout AU only
- [x] WC-backed estimates + `shipping_lines` on orders
- [x] Stripe E2E verified
- [x] Confirmation email
- [x] Sitemap / CMS pages
- [x] Production env deployed

---

## Key files

| Purpose | File |
|---------|------|
| Validate cart | `lib/cart-validation.ts`, `lib/cart-actions.ts` |
| Shipping / GST | `lib/store-config.ts`, `lib/cart-totals.ts`, `lib/order-shipping.ts` |
| Create order | `lib/orders.ts` |
| AU checkout | `lib/au-address.ts`, `lib/checkout-schema.ts` |
| Client cart | `hooks/use-validated-cart.ts` |
| Webhook + revalidation | `app/api/webhooks/woocommerce/route.ts`, `lib/revalidate-catalog.ts` |

---

## Env reference

```env
WC_URL=https://your-store.com
WC_KEY=ck_...
WC_SECRET=cs_...
PROD_URL=https://your-nextjs-site.vercel.app

WC_PAYMENT_METHOD=stripe
WC_PAYMENT_METHOD_TITLE=Credit Card (Stripe)
WP_PAGE_ABOUT_SLUG=about
WP_PAGE_POLICY_SLUG=privacy-policy

FREE_SHIPPING_THRESHOLD=50
FLAT_RATE_SHIPPING_COST=10
GST_RATE=0.1
```
