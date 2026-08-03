# אלכס נכסים

אתר תיווך אישי לירושלים.

## הרצה מקומית

```bash
npm install
cp .env.example .env.local   # מלאו ערכים ל־Phase 2
npm run dev
```

פתחו http://localhost:3000

### מצבי עבודה

| מצב | מתי | התנהגות |
|-----|-----|---------|
| **דמו** | אין `MONGODB_URI` | נתונים ב־localStorage (Phase 1) |
| **שרת** | יש `MONGODB_URI` | MongoDB + Auth.js + העלאת תמונות |

## Phase 2 — מה להגדיר ב־`.env.local`

ראו [`.env.example`](.env.example) ו־[`docs/DATA_CHECKLIST.md`](docs/DATA_CHECKLIST.md).

מינימום:
- `MONGODB_URI`
- `AUTH_SECRET` (מחרוזת ארוכה אקראית)
- `ADMIN_USERNAME` + `ADMIN_PASSWORD`
- Cloudinary (`CLOUDINARY_*`) להעלאה מהטלפון

אחרי חיבור Mongo, זריעת נתוני דמו (פעם אחת):

```bash
curl -X POST http://localhost:3000/api/seed -H "x-seed-secret: YOUR_SEED_SECRET"
```

(או התחברות כאדמין ואז קריאה ל־`/api/seed`)

## אדמין

- `/admin/login`
- דמו מקומי: `alex` / `alex-demo-2026`
- בפרודקשן: לפי `ADMIN_*` ב־env

## דיפלוי

הקוד ב־GitHub. ל־Phase 2 (שרת + DB) צריך אחסון עם Node — מומלץ **Vercel Free** שמחובר לריפו.  
GitHub Pages מתאים רק לדמו סטטי (Phase 1).

## מסמכים

- [docs/SPEC.md](docs/SPEC.md)
- [docs/PROJECT_RULES.md](docs/PROJECT_RULES.md)
- [docs/DATA_CHECKLIST.md](docs/DATA_CHECKLIST.md)
