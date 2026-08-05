# אלכס נכסים

תיווך דירות בירושלים — אתר למשתמשים / לקוחות.

## האתר החי

**https://alex-nekasim.vercel.app**

פרטי קשר, רישיון תיווך, תמונה וטקסטים של אלכס גריביאן באוויר.  
בוט AI — יתווסף בהמשך (לא בגרסה הנוכחית).

ניהול פנימי מוגדר בנפרד (קישור סודי + סיסמה) — **אין לפרסם** ב־GitHub / README.

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
| **דמו** | אין `MONGODB_URI` | נתונים ב־localStorage של הדפדפן |
| **שרת** | יש `MONGODB_URI` (+ Cloudinary להעלאות) | נתונים משותפים בשרת |

## מסמכים

- [`docs/SPEC.md`](docs/SPEC.md)
- [`docs/COMPLIANCE.md`](docs/COMPLIANCE.md)
- [`docs/PROJECT_RULES.md`](docs/PROJECT_RULES.md)
- [`docs/DATA_CHECKLIST.md`](docs/DATA_CHECKLIST.md)
