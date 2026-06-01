# Ember & Oak — Headless WooCommerce Storefront

A [Next.js](https://nextjs.org) storefront for [WooCommerce](https://woocommerce.com), built for **Australia-only** sales of **simple products** with **Stripe** checkout via WooCommerce’s `payment_url`.

The WordPress/WooCommerce site is the source of truth for products, stock, tax, shipping, orders, and payments. This app handles browsing, cart, checkout, and SEO.

---

## Stack

- **Next.js 16** (App Router)
- **React 19**, **TypeScript**, **Tailwind CSS 4**
- **Zustand** (cart + shop URL state)
- **WooCommerce REST API** (OAuth 1.0a) — products, orders, shipping, tax
- **WordPress REST API** — static pages (`/about`, `/policy`)
- **Stripe** — via [WooCommerce Stripe Payment Gateway](https://woocommerce.com/products/stripe/) on WordPress (not embedded in Next.js)

---

## Features

| Area | Details |
|------|---------|
| Shop | Filters, sort, search, pagination — backed by WC |
| Product pages | `/product/[slug]`, JSON-LD, related products |
| Cart | Persisted client cart; server validation against WC |
| Checkout | AU-only address; subtotal / shipping / GST estimates from WC |
| Orders | Creates WC order with `shipping_lines`; redirects to Stripe |
| CMS | About & privacy policy from WP pages |
| SEO | `sitemap.xml`, `image-sitemap.xml`, `robots.txt` |

---

## Prerequisites

1. **WordPress** + **WooCommerce** (hosted or local)
2. **WooCommerce REST API** keys (Read/Write) — *WooCommerce → Settings → Advanced → REST API*
3. **WooCommerce Stripe Payment Gateway** — enabled, AUD, test or live keys
4. **WooCommerce configured for AU**: currency AUD, GST, Australia shipping zone (flat rate + optional free shipping)

---

## Getting started

### 1. Clone and install

```bash
git clone <your-repo-url>
cd nextjs-woo-headless
npm install
```

### 2. Environment variables

Copy `.env` (or create from the example below). Do not commit secrets.

```env
# WooCommerce (required)
WC_URL=https://your-wordpress-site.com
WC_KEY=ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WC_SECRET=cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Public site URL for SEO / sitemaps / metadata
PROD_URL=http://localhost:3000

# Payments (must match enabled gateway in WP)
WC_PAYMENT_METHOD=stripe
WC_PAYMENT_METHOD_TITLE=Credit Card (Stripe)

# WordPress page slugs for CMS routes
WP_PAGE_ABOUT_SLUG=about
WP_PAGE_POLICY_SLUG=privacy-policy

# Fallbacks if shipping/tax REST endpoints fail
FREE_SHIPPING_THRESHOLD=50
FLAT_RATE_SHIPPING_COST=10
GST_RATE=0.1
```

| Variable | Description |
|----------|-------------|
| `WC_URL` | WordPress site URL (no trailing slash). Must be reachable from your dev machine / Vercel. |
| `WC_KEY` / `WC_SECRET` | WooCommerce REST API credentials |
| `PROD_URL` | Canonical frontend URL (`http://localhost:3000` in dev) |
| `WC_PAYMENT_METHOD` | Gateway ID from WP (usually `stripe`) |
| `WP_PAGE_*_SLUG` | Published page slugs in WordPress |
| `WC_WEBHOOK_SECRET` | Signing secret (must match WooCommerce webhook) |
| `WC_WEBHOOK_SKIP_VERIFY` | Set `true` only for local debugging (never in production) |

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run lint` | ESLint |

---

## WordPress setup (summary)

Configure on the WooCommerce host — not in this repo.

1. **General** — Store in Australia, currency **AUD**
2. **Tax** — Enable GST (10%); choose whether prices include tax
3. **Shipping** — Australia zone: **Flat rate** + optional **Free shipping** (min order)
4. **Payments** — Stripe plugin enabled; test with card `4242 4242 4242 4242`
5. **Pages** — Publish pages with slugs `about` and `privacy-policy` (or override env slugs)
6. **Email** — WooCommerce emails + SMTP plugin if host mail is unreliable

**Checkout flow:** Next.js creates a pending order → customer is sent to `order.payment_url` → Stripe on WordPress → order marked paid in WC.

---

## Webhooks (cache revalidation)

When a product’s price or stock changes in WooCommerce, a webhook refreshes the Next.js cache so the storefront does not wait up to 1 hour (ISR).

### Configure in WordPress

1. **WooCommerce → Settings → Advanced → Webhooks → Add webhook**
2. **Status:** Active  
3. **Topic:** create one webhook per topic (or use “Product updated” first):
   - Product created  
   - Product updated  
   - Product deleted  
   - Product restored  
4. **Delivery URL:** `https://YOUR-VERCEL-DOMAIN/api/webhooks/woocommerce`  
5. **Secret:** generate a long random string → set the same value as `WC_WEBHOOK_SECRET` on Vercel  
6. **API version:** WP REST API v3  

### What gets revalidated

| Target | Mechanism |
|--------|-----------|
| WC product API fetches | `revalidateTag('wc-products')`, `wc-catalog` |
| `/`, `/shop` | `revalidatePath` |
| `/product/[slug]` | `revalidatePath` + per-slug tag when slug is in payload |
| `/sitemap.xml`, `/image-sitemap.xml` | `revalidatePath` |

### Verify

```bash
curl https://YOUR-VERCEL-DOMAIN/api/webhooks/woocommerce
# → { "ok": true, "message": "..." }
```

After saving a product in WP, check **WooCommerce → Settings → Webhooks →** your webhook **Deliveries** (should be `200`). Edit a product price and reload `/shop` — it should reflect without redeploying.

---

## Project structure

```
app/
  page.tsx              # Home
  shop/                 # Catalog + filters
  product/[slug]/       # Product detail
  cart/                 # Cart
  checkout/             # Checkout + success
  about/ | policy/      # CMS pages (WP)
  sitemap.ts            # Dynamic sitemap
  image-sitemap.xml/    # Image sitemap
lib/
  woo-fetch.ts          # WC REST (OAuth)
  wp-fetch.ts           # WP pages API
  products.ts           # Product fetching
  cart-validation.ts    # Server cart validation
  cart-actions.ts       # validateCart / getCartTotals
  order-shipping.ts     # shipping_lines for orders
  orders.ts             # createOrder
  order-lookup.ts       # lookupGuestOrder
  store-config.ts       # Shipping zones + tax from WC
  revalidate-catalog.ts # Cache invalidation helper
  cache-tags.ts         # Fetch cache tag names
app/api/webhooks/woocommerce/  # WC webhook receiver
components/             # UI (cart, checkout, shop, …)
stores/                 # Zustand (cart, shop)
```

---

## Deploy (Vercel)

1. Push the repo to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Add the same environment variables as `.env` (use production `WC_URL` and `PROD_URL`).
4. Deploy.

Ensure the WordPress server allows HTTPS requests from Vercel and REST API keys are valid.

---

## Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/shop` | Product listing (query params for filters/search) |
| `/product/[slug]` | Product detail |
| `/cart` | Shopping cart |
| `/checkout` | Checkout |
| `/checkout/success` | Order confirmation |
| `/order-status` | Guest order lookup (email + order number) |
| `/about` | About (WordPress page) |
| `/policy` | Privacy policy (WordPress page) |
| `/sitemap.xml` | Sitemap |
| `/image-sitemap.xml` | Image sitemap |
| `/api/webhooks/woocommerce` | WooCommerce webhook (POST) |

---

## Roadmap

See [todo.md](./todo.md) for launch status and post-launch ideas.

---

## License

Private project — adjust as needed for your repository.
