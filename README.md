This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Password reset

The sign-in page links to `/forgot-password`. Supabase sends a recovery email
using `resetPasswordForEmail`; `/auth/callback` exchanges the PKCE code and opens
`/reset-password`, where the authenticated user can set a new password.

In Supabase **Authentication → URL Configuration**, set your production Site URL
and add `https://YOUR_DOMAIN/auth/callback?next=/reset-password` to Redirect URLs
(plus the localhost equivalent for development). Keep the reset email template's
`{{ .ConfirmationURL }}` link. Optional `NEXT_PUBLIC_SITE_URL` pins the destination
origin; otherwise the reset action uses the requesting page's origin. Open the
email in the browser that requested it, since PKCE verification uses its cookie.

Run `node --test tests/password-reset.test.mjs` to check validation and actions.
Email delivery must be verified against your configured Supabase project.
See [Supabase password reset documentation](https://supabase.com/docs/reference/javascript/auth-resetpasswordforemail).

### Bot storage

Run `supabase/migrations/20260910000000_create_bots.sql` in your Supabase
project's SQL Editor before using bot creation. It creates the `public.bots`
table, creator identity trigger, and account-scoped read/create/delete policies.
Alternatively, apply the migration with the Supabase CLI for a linked project.

Each row includes `user_id`, `creator_email`, `creator_username`, bot settings,
and `created_at`. Creator details are captured from the account when the bot is
created; the username falls back to the full name, then the email prefix.
Bots persist across navigation and sign-ins. Dashboard deletion removes the
database row; deleting a row in Supabase is reflected when the bot page reloads.
Previously unsaved, in-memory drafts cannot be recovered after leaving the page.

### Wallet balances

Portfolio reads the connected Phantom wallet on Solana mainnet. Deposits to
that address appear after confirmation, with automatic refresh every 30 seconds,
refresh on tab focus, and a manual refresh button. No database migration is
required for wallet balances. This does not create a custodial cash account.

Set `SOLANA_RPC_URL` on the server to a Solana mainnet RPC endpoint for your
deployment. Without it, the app uses the public mainnet endpoint, which can be
rate-limited. The URL is never sent to the browser.

The balance route uses Solana's `getBalance` and
[`getTokenAccountsByOwner`](https://solana.com/docs/rpc/http/gettokenaccountsbyowner)
for both token programs. Raw token quantities are summed before decimal
formatting. USD estimates use [Dexscreener](https://docs.dexscreener.com/api/reference)
quotes for up to 60 mints; unpriced assets remain visible with their quantities.
Totals are unavailable when any included asset is unpriced. USDC and USDT are
classified by mint address as stablecoins. Draft bot allocations are not holdings.
Other networks, staked SOL accounts, and confidential token balances are not
included. Database account credits are not implemented by this wallet integration.

Run balance checks with `node --test tests/wallet-balances.test.mjs`.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
