// ─── Central pricing config ───────────────────────────────────────────────────
// Change prices here only. All pages and APIs import from this file.
//
// TEST_MODE: set to true to charge RM 1 via Billplz for testing.
// Set to false before going live.
// TEST_MODE = true → uses Simulate Payment (no Billplz), prices show RM1 for testing
// TEST_MODE = false → live Billplz payment at RM79/RM129
// Switch to false ONLY after DOKU payment gateway is approved & live
const TEST_MODE = false

export const PRICING = {
  single: {
    amountSen:    TEST_MODE ? 100  : 7900,   // RM 1.00 (test) / RM 79.00 (live)
    displayRM:    TEST_MODE ? 'RM 1'  : 'RM 79',
    displayFull:  TEST_MODE ? 'RM 1.00' : 'RM 79.00',
  },
  bundle: {
    amountSen:    TEST_MODE ? 100  : 12900,  // RM 1.00 (test) / RM 129.00 (live)
    displayRM:    TEST_MODE ? 'RM 1'  : 'RM 129',
    displayFull:  TEST_MODE ? 'RM 1.00' : 'RM 129.00',
    savingSen:    2900,   // RM 29.00 savings vs 2x single
    savingRM:     'RM 29',
    credits:      2,
  },
} as const

export type PricingPlan = 'single' | 'bundle'
