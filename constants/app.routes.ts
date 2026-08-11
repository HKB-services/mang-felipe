export const BASE_ROUTE = "/"

const TEST_UI_ROUTES = {
  ROOT: "/test-ui",
}

const HIDDEN_ROUTES = {
  REGISTER_ADMIN: "/register-admin",
}

const AUTH_ROUTES = {
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  ACCOUNT: "/account",
  SECURITY: "/security",
}

const SIDEBAR_ROUTES = {
  DASHBOARD: "/dashboard",
  ADMIN: "/admin",
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_MENU: "/admin/menu",
}
const PUBLIC_ROUTES = {
  HISTORY: "/history",
  CONTACT: "/contact",
  ORDER: "/order",
  ORDER_CHECKOUT: "/order/checkout",
  TRACK: "/track",
}

export const ROUTES = {
  HOME: BASE_ROUTE,
  HISTORY: PUBLIC_ROUTES.HISTORY,
  CONTACT: PUBLIC_ROUTES.CONTACT,
  ORDER: PUBLIC_ROUTES.ORDER,
  ORDER_CHECKOUT: PUBLIC_ROUTES.ORDER_CHECKOUT,
  TRACK: PUBLIC_ROUTES.TRACK,
  DASHBOARD: SIDEBAR_ROUTES.DASHBOARD,
  ADMIN: SIDEBAR_ROUTES.ADMIN,
  ADMIN_ORDERS: SIDEBAR_ROUTES.ADMIN_ORDERS,
  ADMIN_MENU: SIDEBAR_ROUTES.ADMIN_MENU,
  LOGIN: AUTH_ROUTES.LOGIN,
  FORGOT_PASSWORD: AUTH_ROUTES.FORGOT_PASSWORD,
  ACCOUNT: AUTH_ROUTES.ACCOUNT,
  SECURITY: AUTH_ROUTES.SECURITY,
  TEST_UI: TEST_UI_ROUTES.ROOT,
  REGISTER_ADMIN: HIDDEN_ROUTES.REGISTER_ADMIN,
}

/** Routes under `app/(protected)` — require a valid session in proxy/layout. */
export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.ACCOUNT,
  ROUTES.SECURITY,
  ROUTES.ADMIN,
  ROUTES.ADMIN_ORDERS,
  ROUTES.ADMIN_MENU,
] as const

/** Public auth pages — redirect to home when already authenticated. */
export const PUBLIC_AUTH_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.FORGOT_PASSWORD,
] as const
