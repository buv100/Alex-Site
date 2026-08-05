/** Site config — business details from Alex (DATA_CHECKLIST) */
export const siteConfig = {
  brandName: "אלכס נכסים",
  ownerFullName: "אלכס גריביאן",
  tagline: "הסוכנות המובילה בירושלים — יחס אישי ונסיון של מעל 20 שנה",
  /** Portrait for hero / about — file in /public */
  portraitSrc: "/images/alex-garibian.jpg",
  portraitAlt: "אלכס גריביאן — מתווך נדל״ן בירושלים",
  aboutShort:
    "הסוכנות המובילה בירושלים: יחס אישי, נסיון מעל 20 שנה, היכרות מעמיקה עם כל שכונות ירושלים. דובר 4 שפות.",
  aboutLong: `אלכס גריביאן הוא מתווך נדל״ן הפועל בירושלים ומתמחה בדירות מגורים למכירה ולהשכרה.

הסוכנות המובילה בירושלים — יחס אישי, נסיון של מעל 20 שנה, והיכרות מעמיקה עם כל שכונות העיר. אלכס דובר 4 שפות ומלווה קונים, שוכרים ומוכרים מהפגישה הראשונה ועד המפתח.

העבודה אישית: כל נכס מטופל ישירות על ידי אלכס, עם דגש על התאמה נכונה ולא על כמות.`,
  whyWorkWithAlex: [
    "הסוכנות המובילה בירושלים",
    "יחס אישי — לא מוקד ולא תורים",
    "נסיון של מעל 20 שנה",
    "היכרות מעמיקה עם כל שכונות ירושלים",
    "דובר 4 שפות",
  ],
  phone: "052-850-8407",
  phoneTel: "+972528508407",
  whatsapp: "972528508407",
  email: "alexgaribian10@gmail.com",
  licenseNumber: "26523",
  licenseHolderName: "אלכס גריביאן",
  dataControllerName: "אלכס גריביאן",
  privacyRequestsEmail: "alexgaribian10@gmail.com",
  legalDraftUpdatedAt: "2026-08-05",
  city: "ירושלים",
  accessibilityCoordinator: {
    name: "אלכס גריביאן",
    phone: "052-850-8407",
    email: "alexgaribian10@gmail.com",
  },
  neighborhoods: [
    "רחביה",
    "קטמון",
    "בקעה",
    "טלביה",
    "נחלאות",
    "מאה שערים",
    "גילה",
    "ארנונה",
    "המושבה הגרמנית",
    "קרית יובל",
    "פסגת זאב",
    "רמות",
  ],
} as const;

export const DEMO_ADMIN = {
  username: "alex",
  /** Local demo only — production uses ADMIN_PASSWORD in Vercel env */
  password: "alex-demo-2026",
} as const;
