# משנתי — טופס "בטיחות נתונים" (Google Play Data Safety)

תשובות מוכנות לסעיף **Data safety** בקונסולת Google Play. נבנה לפי מה שהקוד עושה בפועל (אומת מול הקוד באוקטובר 2026, גרסה 1.5.132) ותואם ל-`terms.html`.
**כלל:** כל שינוי באיסוף נתונים בקוד צריך להתעדכן גם כאן, גם ב-`terms.html` וגם בקונסולה. סתירה ביניהם היא סיבה לדחייה.

---

## שאלות פתיחה
- **Does your app collect or share any of the required user data types?** → **Yes**
- **Is all of the user data collected by your app encrypted in transit?** → **Yes** (HTTPS / Firebase)
- **Which of the following methods of account creation does your app support?** → **OAuth (Sign in with Google)**. התחברות אופציונלית; יש גם מזהה אנונימי אוטומטי.
- **Delete account URL** → **https://mishnayot-alpha.vercel.app/terms.html#delete**
- **Do you provide a way for users to request that some or all of their data is deleted, without requiring them to delete their account?** → **Yes** (כיבוי לוח המובילים, עזיבת קבוצה, שחרור פרק, כיבוי תזכורות)

## האם הנתונים "Shared" (משותפים עם צד שלישי)?
→ **No.** Firebase/Google ו-Vercel הם ספקי שירות (service providers) שמעבדים בשמנו, וזה לא נחשב "sharing" לפי הגדרת Google. הטקסט שנשלח ל-Google TTS הוא טקסט המשנה בלבד ואינו נתון משתמש. אין פרסומות, אין רשתות מודעות, ואין מכירת נתונים.
> נתונים שמשתמשים **אחרים** רואים (לוח מובילים, קבוצות, מבצע) הם חלק מפונקציונליות האפליקציה, ולפי Google זה לא "sharing" עם צד שלישי.

---

## סוגי הנתונים שנאספים (Collected)

| קטגוריה ב-Play | פריט | חובה/אופציונלי | מטרה | איפה בקוד |
|---|---|---|---|---|
| **Personal info** | **Name** | אופציונלי | App functionality, Account management | כינוי/שם בלוח המובילים, בקבוצות ובמבצע; שם מ-Google בהתחברות |
| **Personal info** | **Email address** | אופציונלי (רק בהתחברות Google) | Account management | Firebase Auth + `tehillim_google_user` |
| **Personal info** | **User IDs** | חובה (מזהה אנונימי אוטומטי) | App functionality | Firebase Anonymous Auth uid |
| **Photos and videos** | — | **לא**. תמונת הפרופיל מ-Google נשמרת כקישור בלבד ולא נאספת כקובץ. | | |
| **App activity** | **App interactions** | אופציונלי* | App functionality, Analytics | זכויות/רצף/פרקים בלוח המובילים, מונה לימוד אנונימי, Vercel Web Analytics |
| **App activity** | **Other user-generated content** | אופציונלי | App functionality | הקדשות במבצע (בדרך כלל שם נפטר, לעילוי נשמה), שמות קבוצות, גיבוי ענן (מועדפים, הערות, שמות לרפואה), תשובות סקר |
| **App info and performance** | **Crash logs** + **Diagnostics** | חובה (אוטומטי) | App functionality (תיקון תקלות) | `errorLogs` (הודעה, עמוד, user-agent, גרסה) |
| **Device or other IDs** | **Device or other IDs** | אופציונלי (רק עם תזכורות) | App functionality | FCM token ב-`pushTokens` |

\* לוח המובילים פעיל כברירת מחדל, אבל אפשר לכבות אותו. לכן "Users can choose whether this data is collected" = **Yes**.

> **לא נאסף:** מיקום, אנשי קשר, תמונות/קבצים, הקלטות קול (נשמרות **במכשיר בלבד**, IndexedDB), מספר טלפון, מידע פיננסי (Ko-fi מטפל בתשלום בעצמו, בחלון שלו), היסטוריית גלישה, מזהי פרסום.

---

## לכל פריט (אם נשאל)
- **Collected** (לא shared).
- **Processed ephemerally?** → No.
- **Required or optional?** → לפי הטבלה.
- **Purposes** → App functionality. בנוסף Analytics ל-App interactions ו-Account management ל-Name/Email.

## הערות
- בקשת מחיקה במייל: tehilon2026@gmail.com, טיפול תוך 30 יום (ההתחייבות כתובה ב-`terms.html#delete`).
- `errorLogs` ו-`surveys` כוללים שדה `expireAt` (שנה מהיצירה). **צריך להפעיל מדיניות TTL בקונסולת Firestore** (Firestore ← TTL ← collection `errorLogs` ושדה `expireAt`, וכנ"ל ל-`surveys`), כדי שההבטחה למחיקה תוך 12 חודשים תתקיים.
- כתובת מדיניות הפרטיות לקונסולה: **https://mishnayot-alpha.vercel.app/terms.html**
