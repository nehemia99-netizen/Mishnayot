# משנתי — טופס "בטיחות נתונים" (Google Play Data Safety)

תשובות מוכנות לסעיף **Data safety** בקונסולת Google Play. בנוי לפי איך שהאפליקציה באמת עובדת
(Firebase: אימות אנונימי + Firestore; ללא פרסומות וללא מעקב).

---

## שאלות פתיחה
- **Does your app collect or share any of the required user data types?** → **Yes** (מעט; ראה למטה).
- **Is all of the user data collected by your app encrypted in transit?** → **Yes** (כל התעבורה דרך HTTPS/Firebase).
- **Do you provide a way for users to request that their data is deleted?** → **Yes**
  (המשתמש יכול לכבות "הצטרפות ללוח המובילים" ולהסיר את שמו, ולנקות את הנתונים המקומיים במכשיר;
  לפנייה למחיקה מלאה — דוא"ל tehilon2026@gmail.com).

## האם הנתונים "Shared" (משותפים עם צד שלישי)?
→ **No.** הנתונים מעובדים רק ע"י Firebase/Google כספק תשתית (service provider), לא "משותפים" לפי הגדרת Google,
ולא נמכרים/מועברים לצדדים שלישיים. **ללא מעקב פרסומי, ללא רשתות מודעות.**

> הערה: ההקראה הקולית (TTS) משתמשת ב-Google Cloud TTS כספק תשתית — נשלח אליו **טקסט המשנה בלבד** (לא נתוני משתמש),
> לצורך הפקת האודיו. אין בכך איסוף או שיתוף של נתונים אישיים.

---

## סוגי הנתונים שנאספים (Collected)

| קטגוריה ב-Play | פריט | נאסף? | חובה/אופציונלי | מטרה | משותף? |
|---|---|---|---|---|---|
| **Personal info** | Name (שם תצוגה) | כן | **אופציונלי** — רק אם המשתמש בוחר להופיע בלוח המובילים | App functionality (לוח מובילים/קבוצות) | לא |
| **App activity** | App interactions (התקדמות לימוד: ניקוד/רצף/פרקים/שינון) | כן | אופציונלי (סנכרון קהילתי) | App functionality, Analytics | לא |
| **App info & performance** | Crash logs / Diagnostics (לוג שגיאות) | כן | אופציונלי | App functionality (תיקון תקלות) | לא |
| **Device or other IDs** | Push token (FCM) | כן | אופציונלי | App functionality (תזכורות/התראות) | לא |

> **לא נאסף:** מיקום, אנשי קשר, תמונות/מדיה, אימייל/טלפון, מידע פיננסי, היסטוריית גלישה, מזהי פרסום.
> רוב נתוני המשתמש (לימוד, הגדרות, מועדפים, הקלטות קוליות) נשמרים **מקומית במכשיר בלבד** ואינם נאספים על-ידינו.

---

## ניסוח קצר ל"For each data type" (לכל פריט, אם נשאל)
- **Collected** (לא רק shared).
- **Processed ephemerally?** No (נשמר כל עוד המשתמש פעיל/בחר להופיע).
- **Required or optional?** Optional — המשתמש בוחר אם להצטרף ללוח/קבוצות/תזכורות.
- **Purposes:** App functionality (ובמקרה של פעילות — גם Analytics בסיסי, ללא פרסום).

## הערות
- האימות הוא **אנונימי** (Firebase Anonymous Auth) — אין הרשמה עם אימייל/סיסמה, אין זהות אישית מחייבת.
- "שם התצוגה" הוא כינוי שהמשתמש מזין בעצמו (ברירת מחדל: "משתמש אנונימי").
- ההקלטות הקוליות (שינון) נשמרות **במכשיר בלבד** ואינן נשלחות לשרת.
- כתובת מדיניות הפרטיות לקונסולה: **https://mishnayot-alpha.vercel.app/terms.html**
