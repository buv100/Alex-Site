# חיבור Mongo חינמי (בלי Atlas)

האתר עובר למצב **server** כשמוגדר `MONGODB_URI` ב־Vercel. הקוד (mongoose) לא משתנה.

## אפשרות A — OVHcloud Discovery (מומלץ לפי התוכנית)

מדריך רשמי: [Getting started with MongoDB](https://docs.ovhcloud.com/en/guides/public-cloud/databases/mongodb-getting-started)

1. הירשם / התחבר ל־[OVHcloud](https://www.ovhcloud.com/) וצור **Public Cloud** project.
2. בתפריט: **Databases** → **Create a database instance**.
3. בחר **MongoDB**. תוכנית **Discovery** / `db2-free` אמורה להיות ברירת מחדל (Gravelines, 3 nodes, Public network).
4. לחץ **Order** — חכה עד שהשירות Ready.
5. הגדר משתמש + סיסמה, וודא שגישה ציבורית מותרת (IP allowlist / `0.0.0.0/0` אם מוצע).
6. העתק את מחרוזת החיבור והוסף שם DB, למשל:
   `mongodb://USER:PASSWORD@HOST:27017/alex-nekasim?...`
7. **שים לב:** OVH הודיעו ש־Discovery צפוי להסתיים ב־**31/08/2026**. אם כבר לא זמין בממשק — עבור לאפשרות B.

בדיקה ב־Compass: New Connection → הדבק את המחרוזת → Connect.

## אפשרות B — Clever Cloud Mongo (~500MB חינם)

1. [clever.cloud](https://www.clever.cloud/) → צור חשבון.
2. צור Add-on **MongoDB** (תוכנית free).
3. העתק `MONGODB_ADDON_URI`. אם צריך: הוסף `?directConnection=true`.
4. השתמש בערך הזה כ־`MONGODB_URI`.

## אפשרות C — MongoDB Atlas M0

אם מופיע **Free / M0** בממשק Atlas — אותו דבר: Connection String → `MONGODB_URI`.

## אחרי שיש מחרוזת

**ב־Vercel (Production):**

```bash
npx vercel env add MONGODB_URI production
# הדבק את המחרוזת כשתתבקש
npx vercel --prod
```

**מקומית:**

```bash
cp .env.example .env.local
# ערוך MONGODB_URI
npm run dev
```

**אימות:** פתח `https://alex-nekasim.vercel.app/api/health` — צריך `"mode":"server"`.

אל תעלה סיסמאות ל־GitHub / README / צ׳אט ציבורי אם אפשר להימנע — העדף `vercel env add`.
