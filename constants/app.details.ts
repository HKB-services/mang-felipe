/**
 * Public product copy — landing hero, footer, about blurb.
 * Contact numbers also live in `constants/contact.ts`.
 */

export const APP_DETAILS = {
    name: "Mang Felipe",
    parentCompany: "Happy Moments Food Corporation",
    foundedYear: 2020,
    serviceAreas: ["Metro Manila", "Cavite", "Laguna"] as const,
    /**
     * Short brand pitch for hero / footer / meta.
     */
    description:
        "Mang Felipe serves freshly prepared meals made with carefully selected quality ingredients, thoughtfully prepared for discerning customers across Metro Manila, Cavite, and Laguna since 2020.",
    /**
     * Orders CTA line (Viber primary).
     */
    ordersViberDisplay: "Viber +63 0917 310 2345",
    ordersViberTel: "639173102345",
    logo: "/logo/mang-felipe.jpg",
} as const

export default APP_DETAILS
