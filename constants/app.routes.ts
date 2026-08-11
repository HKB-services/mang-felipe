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
}
const PUBLIC_ROUTES = {
  HISTORY: "/history",
  CONTACT: "/contact",
  ORDER: "/order",
  TRACK: "/track",
}

export const ROUTES = {
  HOME: BASE_ROUTE,
  HISTORY: PUBLIC_ROUTES.HISTORY,
  CONTACT: PUBLIC_ROUTES.CONTACT,
  ORDER: PUBLIC_ROUTES.ORDER,
  TRACK: PUBLIC_ROUTES.TRACK,
  DASHBOARD: SIDEBAR_ROUTES.DASHBOARD,
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
] as const

/** Public auth pages — redirect to home when already authenticated. */
export const PUBLIC_AUTH_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.FORGOT_PASSWORD,
] as const
