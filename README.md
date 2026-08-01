# אלכס נכסים

אתר תיווך אישי — Phase 1 דמו (ללא DB אמיתי).

## הרצה מקומית

```bash
npm install
npm run dev
```

פתחו [http://localhost:3000](http://localhost:3000).

## פרסום ב־GitHub Pages

אחרי push ל־`main`, Actions בונה ומפרסם את האתר.
כתובת לדוגמה: `https://<username>.github.io/<repo-name>/`

ב־GitHub: **Settings → Pages → Source = GitHub Actions**.

## כניסת אדמין (דמו)

- נתיב: `/admin/login`
- משתמש: `alex`
- סיסמה: `alex-demo-2026`

האדמין מותאם למובייל וכולל מתג שפה עברית/רוסית.

## מסמכים

- [docs/SPEC.md](docs/SPEC.md) — אפיון
- [docs/PROJECT_RULES.md](docs/PROJECT_RULES.md) — חוקי עבודה
- [docs/DATA_CHECKLIST.md](docs/DATA_CHECKLIST.md) — מה להעביר לתוכן אמיתי

## הערות דמו

- הנתונים נשמרים ב־`localStorage` בדפדפן.
- תמונות בדמו דרך picsum / קישורי URL.
- פרטי קשר ורישיון הם placeholders עד מילוי ה־checklist.
