# חיבור Neon Postgres (חינם) — אלכס נכסים

האתר עובר למצב **server** כשמוגדר `DATABASE_URL` ב־Vercel.  
אין צורך ב־MongoDB Atlas.

## למה Neon?

MongoDB Atlas לעיתים **לא מציג** תוכנית Free בממשק.  
Neon נותן Postgres חינמי עם הרשמה ב־GitHub / Google — בלי כרטיס אשראי בדרך כלל.

## שלבים (כ־5 דקות)

1. פתח: [https://console.neon.tech/signup](https://console.neon.tech/signup)
2. התחבר עם **GitHub** או **Google**.
3. צור פרויקט (למשל שם: `alex-nekasim`). אזור קרוב (Frankfurt / EU) עדיף.
4. אחרי היצירה, במסך Connection Details:
   - בחר **Connection string**
   - העתק את המחרוזת שמתחילה ב־`postgresql://...`
   - מומלץ **pooled** (יש לפעמים מתג / תווית `Pooler` או host עם `-pooler`)
5. **אל תדביק** את המחרוזת ב־GitHub / צ׳אט ציבורי.

## חיבור ל־Vercel

בפרויקט ב־Vercel → Settings → Environment Variables:

| Name | Value |
|------|--------|
| `DATABASE_URL` | המחרוזת מ־Neon (Production) |

שמור → Redeploy (Deployments → … → Redeploy).

או מקומית (אם מותקן Vercel CLI):

```bash
npx vercel env add DATABASE_URL production
```

## אימות

אחרי דיפלוי פתח:

`https://YOUR-SITE.vercel.app/api/health`

צריך משהו כמו:

```json
{ "db": true, "cloudinary": false, "mode": "server" }
```

`mode: "server"` = נכסים נשמרים בשרת וכולם רואים אותם.  
להעלאת תמונות מהטלפון עדיין צריך גם **Cloudinary** (`cloudinary: true`).

## מקומית (אופציונלי)

ב־`.env.local`:

```
DATABASE_URL=postgresql://...
```

הטבלאות נוצרות אוטומטית בפעם הראשונה שה־API מתחבר ל־DB.
