/** Placeholder site config — replace via DATA_CHECKLIST */
export const siteConfig = {
  brandName: "אלכס נכסים",
  tagline: "תיווך אישי לדירות בירושלים",
  aboutShort:
    "אלכס מלווה קונים, שוכרים ומוכרים בירושלים ביחס אישי, שקיפות מלאה וליווי צמוד — מהפגישה הראשונה ועד המפתח.",
  aboutLong: `אלכס הוא מתווך נדל״ן הפועל בירושלים ומתמחה בדירות מגורים למכירה ולהשכרה.
האתר נועד לנוחות הלקוחות והמכרים — כל הפרטים, התמונות והפניות במקום אחד, במקום שיחות אינסופיות ושליחת קבצים הלוך ושוב.
העבודה היא אישית: כל נכס מטופל ישירות על ידי אלכס, עם דגש על התאמה נכונה ולא על כמות.`,
  whyWorkWithAlex: [
    "ליווי אישי מקצה לקצה — לא מוקד ולא תורים",
    "היכרות עמוקה עם שכונות ירושלים",
    "שקיפות במחיר ובמצב הנכס",
    "זמינות בוואטסאפ ובטלפון",
  ],
  phone: "050-000-0000",
  phoneTel: "+972500000000",
  whatsapp: "972500000000",
  email: "leads@alex-nekasim.demo",
  /** Placeholders until DATA_CHECKLIST is filled */
  licenseNumber: null as string | null,
  licenseHolderName: null as string | null,
  dataControllerName: "אלכס (פרטים מלאים יושלמו)",
  privacyRequestsEmail: "leads@alex-nekasim.demo",
  legalDraftUpdatedAt: "2026-08-05",
  city: "ירושלים",
  accessibilityCoordinator: {
    name: null as string | null,
    phone: null as string | null,
    email: "accessibility@alex-nekasim.demo",
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
  /** Demo only — Phase 2 will use hashed secrets in env */
  password: "alex-demo-2026",
} as const;
