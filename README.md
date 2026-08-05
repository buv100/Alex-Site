# אלכס נכסים

תיווך דירות בירושלים — אתר למשתמשים / לקוחות.

## פתיחת האתר (צד משתמש)

**https://alex-nekasim.vercel.app**

הקישור מתעדכן אחרי כל פרסום.  
גלישת נכסים, יצירת קשר ומועדפים בלבד.

---

## הרצה מקומית (פיתוח)

```bash
npm install
cp .env.example .env.local
npm run dev
```

http://localhost:3000

ניהול פנימי מוגדר מקומית דרך משתני סביבה — **אין לפרסם קישורי ניהול או סיסמאות ב־GitHub / README**.

### מצבי עבודה

| מצב | מתי | התנהגות |
|-----|-----|---------|
| **דמו** | אין `MONGODB_URI` | נתונים ב־localStorage |
| **שרת** | יש `MONGODB_URI` | MongoDB + Auth + העלאת תמונות |

## Phase 2 — env

ראו [`.env.example`](.env.example) ו־[`docs/DATA_CHECKLIST.md`](docs/DATA_CHECKLIST.md).

## מסמכים

- [`docs/SPEC.md`](docs/SPEC.md)
- [`docs/PROJECT_RULES.md`](docs/PROJECT_RULES.md)
- [`docs/DATA_CHECKLIST.md`](docs/DATA_CHECKLIST.md)
