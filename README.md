# אלכס נכסים

תיווך דירות בירושלים — אתר למשתמשים / לקוחות.

## פתיחת האתר (צד משתמש בלבד)

**https://alex-nekasim.vercel.app**

הקישור מתעדכן אחרי כל פרסום.  
אין כאן כניסת מנהל לאלכס — רק גלישת נכסים, יצירת קשר ומועדפים.

---

## הרצה מקומית (פיתוח)

```bash
npm install
cp .env.example .env.local
npm run dev
```

http://localhost:3000

אדמין של אלכס: [https://alex-nekasim.vercel.app/admin/login](https://alex-nekasim.vercel.app/admin/login)  
(אין קישור בפוטר הציבורי — רק מי שיודע את הכתובת נכנס; דורש התחברות.  
מקומית: `http://localhost:3000/admin/login` אחרי `npm run dev`.)

### מצבי עבודה

| מצב | מתי | התנהגות |
|-----|-----|---------|
| **דמו** | אין `MONGODB_URI` | נתונים ב־localStorage |
| **שרת** | יש `MONGODB_URI` | MongoDB + Auth + העלאת תמונות |

## Phase 2 — env

ראו [`.env.example`](.env.example) ו־[`docs/DATA_CHECKLIST.md`](docs/DATA_CHECKLIST.md).

## מסמכים

- [docs/SPEC.md](docs/SPEC.md)
- [docs/PROJECT_RULES.md](docs/PROJECT_RULES.md)
- [docs/DATA_CHECKLIST.md](docs/DATA_CHECKLIST.md)
