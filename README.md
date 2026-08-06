# אלכס נכסים

תיווך דירות בירושלים — אתר למשתמשים / לקוחות.

## האתר החי

**https://alex-nekasim.vercel.app**

פרטי קשר, רישיון תיווך, תמונה וטקסטים של אלכס גריביאן באוויר.  
כולל צ׳אט עזרה בעברית לשאלות על נכסים ועל אלכס.

---

## הרצה מקומית

```bash
npm install
cp .env.example .env.local
npm run dev
```

```bash
npm test
npm run build
```

### מצבי עבודה

| מצב | מתי | התנהגות |
|-----|-----|---------|
| **מקומי** | אין `DATABASE_URL` | נתונים ב־localStorage של הדפדפן |
| **שרת** | יש `DATABASE_URL` (+ Cloudinary להעלאות) | נתונים משותפים בשרת |

`DATABASE_URL` = **Neon Postgres Free** — ראו [`docs/DATA_CHECKLIST.md`](docs/DATA_CHECKLIST.md) ו־[`docs/NEON_SETUP.md`](docs/NEON_SETUP.md).

אופציונלי לצ׳אט LLM חינמי: `GROQ_API_KEY` (בלי זה הצ׳אט עובד במצב FAQ + נכסים מפורסמים).

## מסמכים

- [`docs/SPEC.md`](docs/SPEC.md)
- [`docs/COMPLIANCE.md`](docs/COMPLIANCE.md)
- [`docs/PROJECT_RULES.md`](docs/PROJECT_RULES.md)
- [`docs/DATA_CHECKLIST.md`](docs/DATA_CHECKLIST.md)
