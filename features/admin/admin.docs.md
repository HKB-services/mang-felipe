# Admin feature

Protected dashboard for menu + order ops.

Canonical product/UI rules: `docs/ADMIN.md`.
Auth: `features/auth/auth.docs.md`.
Schema: `docs/DATABASE_SCHEMA.md`.
Lalamove / guest track: `features/track-order/track-order.docs.md`.

**Status:** docs first; implement screens later. Partial: account/security pages,
order detail + Lalamove form, user search helpers.

## Responsibilities

- Ops dashboard (pending / upcoming summary).
- Order list + detail: payment proof review, confirm / reject / cancel, notes.
- Paste Lalamove tracking URL on delivery orders (save + optional email).
- Menu CRUD: categories, items, variants, images, soft-hide; later `isFeatured`.
- Account / security screens for the logged-in admin.

## Planned structure

```text
features/admin/
  admin.docs.md
  account/
    AccountPage.tsx
  security/
    SecurityPage.tsx
  users/
    search-users.ts
    schema/
    server/
  orders/
    pages/
      AdminOrdersList.tsx      # planned
      AdminOrderDetail.tsx     # partial (exists)
    actions/                  # planned review / list
  menu/                       # planned
    pages/
    actions/
```

App routes under `app/(protected)/` — see `docs/ADMIN.md` § Routes.

## Nav (sidebar)

Source: `features/sidebar/sidebar-nav.config.ts`.

Planned groups:

| Group | Items |
| --- | --- |
| Overview | Dashboard |
| Orders | All orders (filter pending by default optional) |
| Menu | Categories / items hub |
| (dev) | Test UI |

Account + Security stay in user menu footer, not primary nav pills.

## Auth boundary

- Pages: protected layout session check.
- Mutations: `authActionClient` + `user.roles`.
- Do not reuse guest `actionClient` for review / menu writes.

## Notes

- No inventory.
- Payment proof: admin-only signed R2 read; never on public track/receipt.
- Sister brands are not DB menu brands — UI flavor only.
- Featured Home flag: `MenuItem.isFeatured` (planned in schema docs).
