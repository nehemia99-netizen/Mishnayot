/* ════════════════════════════════════════
   תהילהון — מודול i18n (תרגום ממשק)
   ════════════════════════════════════════ */
(function(global){
'use strict';

const DICT = {
  // עמוד הבית (01-dashboard)
  'app.title':               { he: 'משניון',                en: 'Mishnayon' },
  'home.greeting':           { he: 'ברכת השלום',              en: 'Welcome' },
  'home.streak':             { he: 'רצף ימים',                en: 'Day streak' },
  'home.memorized':          { he: 'למדתי בע״פ',              en: 'Memorized' },
  'home.chaps_today':        { he: 'סה"כ',                    en: 'total' },
  'home.chaps_total_label':  { he: 'פרקים',                   en: 'chapters' },
  'home.challenges_active':  { he: 'אתגרים פעילים',           en: 'Active Challenges' },
  'home.all_challenges':     { he: 'לכל האתגרים ›',           en: 'All challenges ›' },
  'home.btn_free':           { he: 'בחירת פרק',              en: 'Choose Chapter' },
  'home.btn_random':         { he: 'פרק אקראי',               en: 'Random Chapter' },
  'home.btn_favs':           { he: 'מועדפים',                 en: 'Favorites' },
  'home.btn_yizkor':         { he: 'רפואה<br>ולנשמה',          en: 'Health<br>& Memorial' },
  'home.btn_community':      { he: 'קהילה',                   en: 'Community' },
  'home.btn_saved':          { he: 'משניות<br>שמורות',        en: 'Saved<br>Mishnayot' },
  'home.btn_history':        { he: 'היסטוריה',                en: 'History' },
  'home.btn_achievements':   { he: 'הישגים',                  en: 'Achievements' },
  'home.btn_blessings':      { he: 'ברכות',                   en: 'Blessings' },
  'home.share':              { he: '📤 שתף',                  en: '📤 Share' },
  'home.settings_quick':     { he: '⚙️ הגדרות מהיר',          en: '⚙️ Quick settings' },
  'home.dark_mode':          { he: '🌙 מצב לילה',             en: '🌙 Dark mode' },
  'home.reminder':           { he: '🔔 תזכורת יומית',         en: '🔔 Daily reminder' },
  'home.font_size':          { he: '🔤 גודל גופן',            en: '🔤 Font size' },
  'home.all_settings':       { he: 'כל ההגדרות ›',            en: 'All settings ›' },
  'home.hot_chapters':       { he: '🔥 פרקים לוהטים בקהילה',  en: '🔥 Hot chapters' },
  'home.mode_simple':        { he: '📖 עבור ללימוד לשמה',      en: '📖 Lishmah study' },
  'home.mode_challenge':     { he: '🏆 מסלול אתגרי',           en: '🏆 Challenge mode' },
  'home.mode_simple_active': { he: '📖 לימוד לשמה',            en: '📖 Lishmah study' },
  'home.mode_challenge_active':{ he: '🛠️ מסלול אתגרי',        en: '🛠️ Challenge mode' },
  'home.what_is':            { he: '📖 מהי המשנה? הסבר למתחילים', en: '📖 What is the Mishnah?' },
  'home.search':             { he: 'חיפוש משנה',               en: 'Search Mishnah' },
  'home.search_title':       { he: '🔍 חיפוש משנה',            en: '🔍 Search Mishnah' },
  // מוד לימוד לשמה
  'home.mode_simple_small':  { he: '📖 לימוד לשמה',              en: '📖 Lishmah study' },
  'home.simple_read_cycle':  { he: 'למד את כל המשנה',            en: 'Study the Mishnah' },
  'home.simple_daily_chap':  { he: 'משנה יומית',                 en: 'Daily Mishnah' },
  'home.blessing_before':    { he: 'ברכה לפני<br>לימוד',         en: 'Blessing<br>before study' },
  'home.blessing_after':     { he: 'ברכה אחרי<br>לימוד',         en: 'Blessing<br>after study' },
  // הגדרות — תזכורת
  'set.reminder_note':       { he: 'פועל כשהאפליקציה פתוחה',     en: 'Works while the app is open' },

  // טאבים של הגרף
  'tab.day':                 { he: 'יומי',                    en: 'Daily' },
  'tab.week':                { he: 'שבועי',                   en: 'Weekly' },
  'tab.month':               { he: 'חודשי',                   en: 'Monthly' },
  'tab.half_year':           { he: 'חצי שנה',                 en: '6m' },
  'graph.time':              { he: '⏱ זמן',                   en: '⏱ Time' },
  'graph.score':             { he: '✡ זכויות',                en: '✡ Zechuyot' },
  'graph.minutes_unit':      { he: 'דק׳',                     en: 'min' },
  'graph.score_unit':        { he: 'זכויות',                   en: 'points' },
  'graph.label.today':       { he: 'היום בסה״כ',              en: 'Today total' },

  // ברכות
  'bless.title':             { he: '🙏 ברכות ותפילות',        en: '🙏 Blessings & Prayers' },
  'bless.font_size':         { he: 'גודל פונט:',              en: 'Font size:' },
  'bless.before':            { he: 'לפני לימוד משנה',         en: 'Before study' },
  'bless.after_short':       { he: 'אחרי לימוד משנה',         en: 'After study' },
  'bless.hida':              { he: 'יהי רצון (אחרי לימוד משנה)', en: 'Yehi Ratzon (after study)' },
  'bless.sick':              { he: 'מי שברך לחולים',          en: 'Prayer for the sick' },
  'bless.soldiers':          { he: 'מי שברך לחיילים',         en: 'Prayer for soldiers' },
  'bless.chafetz_chaim':     { he: 'תפילת שמירת הלשון — החפץ חיים', en: 'Shmiras Halashon (Chafetz Chaim)' },
  'bless.mayan_3':           { he: 'ברכה מעין שלוש',           en: "Me'ein Shalosh" },
  'bless.ramban':            { he: 'איגרת הרמב"ן',            en: 'Letter of the Ramban' },
  'bless.avot':              { he: 'פרקי אבות — יומי',         en: 'Pirkei Avot — daily' },
  'bless.cemetery':          { he: 'אשר יצר אתכם בדין — בבית העלמין', en: 'Asher Yatzar Etchem - cemetery' },
  'bless.mayan_choose':      { he: 'ניתן לבחור כמה אופציות יחד', en: 'You can pick multiple together' },
  'bless.mayan_after_intro': { he: 'ברכה אחרונה על מזונות · יין · פירות שבעת המינים', en: 'After-blessing on grains · wine · seven-species fruits' },

  // עמוד בחירת פרק (02-selection)
  'sel.title':               { he: 'בחר פרק',                 en: 'Choose Chapter' },
  'sel.tab_books':           { he: '📚 ספרים',                en: '📚 Books' },
  'sel.tab_by_day':          { he: '📅 לפי יום',              en: '📅 By day' },
  'sel.tab_by_date':         { he: '🗓 לפי תאריך',            en: '🗓 By date' },
  'sel.tab_favs':            { he: '❤️ מועדפים',              en: '❤️ Favorites' },
  'sel.tab_by_name':         { he: '🕯 לפי שם',                en: '🕯 By name' },
  'sel.daily_song':          { he: 'שיר של יום',              en: 'Daily song' },
  'sel.read_now':            { he: 'למד עכשיו ←',             en: 'Study now ←' },
  'sel.cycle_sub':           { he: 'למד את כל המשנה',    en: 'Study the whole Mishnah' },
  'sel.cycle_resume':        { he: 'ממשיך מהמקום שעצרת',       en: 'Resuming where you left off' },
  'sel.seq_sub':             { he: 'בחר פרקים ללימוד',         en: 'Pick chapters to study' },
  'sel.seq_create':          { he: 'צור רצף משלך ←',           en: 'Create your own ←' },
  'sel.my_chap_freq':        { he: '⭐ פתיחת המשנה שלי',       en: '⭐ My Mishnah prompt' },
  'sel.hida_title':          { he: '🕯 לימוד משניות לפי שם',   en: '🕯 Study by name' },
  'sel.book1':               { he: 'ספר א׳',                   en: 'Book I' },
  'sel.book2':               { he: 'ספר ב׳',                   en: 'Book II' },
  'sel.book3':               { he: 'ספר ג׳',                   en: 'Book III' },
  'sel.book4':               { he: 'ספר ד׳',                   en: 'Book IV' },
  'sel.book5':               { he: 'ספר ה׳',                   en: 'Book V' },
  'sel.cycle':               { he: 'סבב המשנה',               en: 'Cycle' },
  'sel.cycle_sub':           { he: 'למד את כל המשנה',    en: 'Study the whole Mishnah' },
  'sel.sequence':            { he: 'מחולל רצף',               en: 'Sequence Builder' },
  'sel.sequence_sub':        { he: 'בחר פרקים ללימוד',         en: 'Pick chapters to study' },

  // קורא (03-reader)
  'reader.time':             { he: 'זמן לימוד',               en: 'Study time' },
  'reader.points':           { he: '✡ זכויות',                en: '✡ Zechuyot' },
  'reader.done_btn':         { he: 'סיימתי פרק',              en: 'Finished chapter' },
  'reader.idle_warning':     { he: '⏸ הטיימר נעצר — עבור לפרק הבא כדי להמשיך', en: '⏸ Timer paused — move to next chapter to continue' },

  // היסטוריה (04-history)
  'hist.title':              { he: 'היסטוריה',                en: 'History' },
  'hist.today':              { he: '📅 היום',                 en: '📅 Today' },
  'hist.achievements':       { he: '🏆 הישגים',               en: '🏆 Achievements' },
  'hist.challenges':         { he: '🎯 אתגרים',                en: '🎯 Challenges' },
  'hist.chaps_today':        { he: 'פרקים נלמדו',             en: 'Chapters studied' },
  'hist.reading_time':       { he: 'זמן לימוד',               en: 'Study time' },
  'hist.points':             { he: 'זכויות',                   en: 'Zechuyot' },
  'hist.chaps_today_title':  { he: 'פרקים שנלמדו היום',        en: 'Chapters studied today' },
  'hist.last_7_days':        { he: '7 הימים האחרונים',        en: 'Last 7 days' },
  'hist.delete_today':       { he: '🗑 מחק נתוני לימוד של היום', en: '🗑 Delete today\'s reading data' },

  // הגדרות (06-settings)
  'set.title':               { he: '⚙️ הגדרות',               en: '⚙️ Settings' },
  'set.back_home':           { he: '← בית',                   en: '← Home' },
  'set.display':             { he: 'תצוגה',                   en: 'Display' },
  'set.dark_mode':           { he: 'מצב לילה',                en: 'Dark mode' },
  'set.dark_mode_sub':       { he: 'רקע כהה ללימוד בחושך',    en: 'Dark background for night study' },
  'set.font_size':           { he: 'גודל גופן בלימוד',        en: 'Study font size' },
  'set.font_size_sub':       { he: 'ברירת מחדל לכל הפרקים',   en: 'Default for all chapters' },
  'set.language':            { he: 'שפה',                     en: 'Language' },
  'set.language_sub':        { he: 'שפת ממשק האפליקציה',      en: 'Interface language' },
  'set.lang_he':             { he: 'עברית',                   en: 'Hebrew' },
  'set.lang_en':             { he: 'English',                 en: 'English' },
  'set.reminders':           { he: 'תזכורות',                 en: 'Reminders' },
  'set.daily_reminder':      { he: 'תזכורת יומית',            en: 'Daily reminder' },
  'set.test_notification':   { he: 'שלח תזכורת בדיקה',        en: 'Send test notification' },
  'set.reading':             { he: 'לימוד',                   en: 'Study' },
  'set.privacy':             { he: 'פרטיות',                  en: 'Privacy' },
  'set.score_legend':        { he: '✡ מקרא זכויות',           en: '✡ Zechuyot Legend' },
  'set.show_legend':         { he: 'הצג מקרא זכויות',         en: 'Show Zechuyot Legend' },
  'set.backup':              { he: 'גיבוי ושחזור',            en: 'Backup & Restore' },
  'set.export':              { he: 'ייצוא נתונים',            en: 'Export data' },
  'set.import':              { he: 'ייבוא נתונים',            en: 'Import data' },
  'set.export_btn':          { he: 'ייצא',                    en: 'Export' },
  'set.import_btn':          { he: 'ייבא',                    en: 'Import' },
  'set.about':               { he: 'אודות',                   en: 'About' },
  'set.contact':             { he: 'צור קשר',                 en: 'Contact us' },
  'set.rate':                { he: 'דרג אותנו',               en: 'Rate us' },
  'set.show_tour':           { he: 'הצג סיור מחדש',           en: 'Show tour again' },
  'set.terms':               { he: 'תנאי שימוש',              en: 'Terms of use' },
  'set.reset_all':           { he: '🗑 איפוס כל הנתונים',     en: '🗑 Reset all data' },

  // עמוד בחירת פרק (02-selection) - נוסף 2.1.1
  'sel.back_home':           { he: '← בית',                   en: '← Home' },
  'sel.search':              { he: 'חיפוש',                   en: 'Search' },
  'sel.search_placeholder':  { he: 'מספר · גימטריה · או מילה בעברית...', en: 'Number · gematria · or Hebrew word...' },
  'sel.search_hint':         { he: 'לדוגמה: 23 · כ״ג · שלום · חסד · רפואה', en: 'Examples: 23 · כ״ג · shalom · hesed · refuah' },
  'sel.close':               { he: 'סגור',                    en: 'Close' },
  'sel.no_results':          { he: 'אין תוצאות',              en: 'No results' },
  'sel.favorites':           { he: 'מועדפים',                 en: 'Favorites' },
  'sel.memorized':           { he: 'פרקים שלמדתי בע״פ',       en: 'Memorized chapters' },
  'sel.play_all':            { he: '▶ נגן את כל המועדפים ברצף', en: '▶ Play all favorites' },
  'sel.read_first_day':      { he: '📖 למד פרק ראשון מהיום',   en: '📖 Study first chapter of today' },
  'sel.by_name_title':       { he: '🕯 לימוד משניות לפי שם',    en: '🕯 Study Mishnah by name' },
  'sel.by_name_intro':       { he: 'מנהג קדום — ללמוד משניות לעילוי נשמת אדם, על פי אותיות שמו ואותיות "נשמה".', en: 'An ancient custom - studying Mishnah for the elevation of a soul, by the letters of the name.' },
  'sel.name_label':          { he: 'השם:',                    en: 'The name:' },
  'sel.add_neshama':         { he: 'להוסיף אותיות "נשמה" בסוף (לעילוי נשמה)', en: "Add letters 'neshama' at end (for soul elevation)" },
  'sel.verses_from_119':     { he: '📖 פסוקים מקי"ט',          en: '📖 Verses from 119' },
  'sel.full_chapters':       { he: '📚 פרקים מלאים',           en: '📚 Full chapters' },
  'sel.preview_empty':       { he: 'הזן שם כדי לראות את הפרקים/הפסוקים שייקראו.', en: 'Enter name to see chapters/verses to be read.' },
  'sel.start_reading':       { he: '▶ התחל קריאה',             en: '▶ Start reading' },

  // קורא (03-reader) - נוסף 2.1.1
  'reader.back':             { he: '← בית',                   en: '← Home' },
  'reader.next':             { he: '← הבא',                   en: '← Next' },
  'reader.prev':             { he: 'הקודם →',                 en: 'Prev →' },
  'reader.share_verse':      { he: 'שתף משנה',                en: 'Share mishnah' },
  'reader.save_verse':       { he: 'שמור משנה',               en: 'Save mishnah' },
  'reader.favorite':         { he: 'מועדף',                   en: 'Favorite' },
  'reader.memorize':         { he: 'למדתי בע״פ',              en: 'Memorized' },
  'reader.shinun':           { he: 'שינון',                   en: 'Practice' },
  'reader.loading':          { he: 'טוען...',                 en: 'Loading...' },

  // היסטוריה (04-history) - נוסף 2.1.1
  'hist.back':               { he: '← בית',                   en: '← Home' },
  'hist.period_today':       { he: 'היום',                    en: 'Today' },
  'hist.period_week':        { he: '7 ימים',                  en: '7 days' },
  'hist.period_month':       { he: '30 יום',                  en: '30 days' },
  'hist.period_all':         { he: 'הכל',                     en: 'All time' },
  'hist.medals':             { he: '🏅 המדליות שלי',          en: '🏅 My Medals' },
  'hist.level_card':         { he: 'הרמה שלי',                en: 'My Level' },
  'hist.chapters_map':       { he: '📖 מפת הפרקים שלי',       en: '📖 My Chapters Map' },
  'hist.books_5':            { he: '6 סדרי המשנה',           en: '6 Orders of Mishnah' },
  'hist.legend_read':        { he: 'נקרא',                    en: 'Read' },
  'hist.legend_mem':         { he: 'למדתי בע״פ',              en: 'Memorized' },
  'hist.legend_fav':         { he: 'מועדף',                   en: 'Favorite' },
  'hist.legend_none':        { he: 'טרם',                     en: 'Not yet' },
  'hist.challenges_title':   { he: '🎯 האתגרים שלך',          en: '🎯 Your Challenges' },
  'hist.challenges_intro':   { he: 'איסוף זכויות באמצעות אתגרים יומיים, שבועיים וחודשיים', en: 'Collect points via daily, weekly and monthly challenges' },
  'hist.badges_themed':      { he: 'הישגים נושאיים',          en: 'Themed Achievements' },
  'hist.group_challenge':    { he: '👥 אתגר קבוצתי',          en: '👥 Group Challenge' },
  'hist.group_card':         { he: 'אתגר משותף עם הקבוצה',    en: 'Group shared challenge' },
  'hist.group_intro':        { he: 'צרו אתגר משותף — כל חבר לוקח נתח', en: 'Create a shared challenge - each member takes a portion' },
  'hist.open_group':         { he: 'פתח את עמוד הקבוצה ›',   en: 'Open group page ›' },
  'hist.history_challenges': { he: 'היסטוריית אתגרים',        en: 'Challenge history' },
  'hist.no_history':         { he: 'עדיין אין אתגרים שנדרשו.', en: 'No claimed challenges yet.' },

  // הגדרות נוספים
  'set.medal_alert':         { he: 'התראת מדליה',             en: 'Medal alert' },
  'set.medal_alert_sub':     { he: 'פופ-אפ בהגעה למדליה חדשה', en: 'Popup on new medal' },
  'set.daily_reminder_sub_off': { he: 'כבויה',                 en: 'Off' },
  'set.daily_reminder_sub_on':  { he: 'פעילה',                 en: 'On' },
  'set.hourly_reminder':     { he: 'תזכורת שעתית',            en: 'Hourly reminder' },
  'set.hourly_label':        { he: 'תזכיר לי לקרוא כל:',      en: 'Remind me every:' },
  'set.last_chap':           { he: 'זכור פרק אחרון',          en: 'Remember last chapter' },
  'set.last_chap_sub':       { he: 'פתח את הפרק האחרון שקראתי', en: 'Open last read chapter' },
  'set.verse_nums':          { he: 'סימון משניות',            en: 'Mishnah letters' },
  'set.verse_nums_sub':      { he: 'הצג אות ליד כל משנה',     en: 'Show a letter beside each Mishnah' },
  'set.leaderboard':         { he: 'הצג בלוח המובילים',       en: 'Show on leaderboard' },
  'set.leaderboard_sub':     { he: 'שתף את ההתקדמות שלי',     en: 'Share my progress' },
  'set.export_sub':          { he: 'שמור קובץ גיבוי למכשיר',  en: 'Save backup file to device' },
  'set.import_sub':          { he: 'שחזר מקובץ גיבוי',        en: 'Restore from backup file' },
  'set.backup_note':         { he: 'הגיבוי כולל את כל הנתונים: לימודים, ניקוד, מועדפים ושינון.', en: 'Backup includes: studies, scores, favorites, memorized.' },
  'set.test_notif_sub':      { he: 'בדוק שההתראות עובדות',    en: 'Check that notifications work' },
  'set.username_placeholder': { he: 'שם שיופיע בלוח המובילים', en: 'Name to show on leaderboard' },
  'set.account_title':        { he: '☁️ חשבון וגיבוי',           en: '☁️ Account & Backup' },
  'set.reminder_time':        { he: 'שעת תזכורת',                en: 'Reminder time' },
  'set.scroll_speed':         { he: 'מהירות גלילה אוטומטית',     en: 'Auto-scroll speed' },
  'set.scroll_speed_sub':     { he: 'ניתן לשנות גם בתוך הפרק',  en: 'Can be changed inside the chapter' },
  'set.speed_slow':           { he: '🐢 איטית',                  en: '🐢 Slow' },
  'set.speed_normal':         { he: '🚶 רגילה',                  en: '🚶 Normal' },
  'set.speed_fast':           { he: '🏃 מהירה',                  en: '🏃 Fast' },
  'set.speed_very_fast':      { he: '🚀 מהירה מאוד',             en: '🚀 Very fast' },
  'set.cantillation':         { he: 'הצג טעמים',                 en: 'Show cantillation' },
  'set.cantillation_sub':     { he: 'הוסף סימני טעמים לטקסט (ברירת מחדל: ללא)', en: 'Add cantillation marks (default: off)' },
  'set.tts_voice':            { he: 'קול ההקראה',               en: 'Reading voice' },
  'set.tts_voice_sub':        { he: 'הקול לכפתור ההקראה הקולית בקורא', en: 'Voice for the read-aloud button' },
  'set.tts_male':             { he: 'קול גברי (ברירת מחדל)',   en: 'Male voice (default)' },
  'set.tts_female':           { he: 'קול נשי',                  en: 'Female voice' },
  'set.my_chap_banner':       { he: 'באנר "המשנה שלי"',          en: '"My Mishnah" banner' },
  'set.my_chap_banner_sub':   { he: 'מתי להציג את הבאנר בדף הבית', en: 'When to show the banner on home' },
  'set.banner_daily':         { he: 'פעם ביום',                  en: 'Once a day' },
  'set.banner_always':        { he: 'בכל כניסה',                 en: 'Every visit' },
  'set.groups_section':       { he: '👥 קבוצות',                 en: '👥 Groups' },
  'set.group_name':           { he: 'שם לתצוגה בקבוצה',          en: 'Group display name' },
  'set.group_name_sub':       { he: 'מוצג לחברים בקבוצות שלך',   en: 'Shown to members in your groups' },
  'set.leaderboard_name_ph':  { he: 'כינוי ללוח המובילים',        en: 'Leaderboard nickname' },
  'set.what_is_tehilim':      { he: 'מהי המשנה? הסבר למתחילים', en: 'What is the Mishnah?' },

  // קהילה (07-community)
  'comm.title':              { he: '🌍 קהילה',                en: '🌍 Community' },
  'comm.tab_all':            { he: '🌍 כלל הקהילה',           en: '🌍 All Community' },
  'comm.tab_mine':           { he: '👥 הקבוצה שלי',           en: '👥 My Group' },
  'comm.users_registered':   { he: '👥 משתמשים רשומים',       en: '👥 Registered users' },
  'comm.online_now':         { he: 'מחוברים עכשיו',           en: 'Online now' },
  'comm.chaps_today':        { he: '📖 פרקים נלמדו היום',     en: '📖 Chapters studied today' },
  'comm.mins_today':         { he: '⏱ דקות לימוד היום',       en: '⏱ Minutes today' },
  'comm.hot_chaps':          { he: '🔥 פרקים לוהטים השבוע',    en: '🔥 Hot chapters this week' },
  'comm.leaderboard':        { he: '🏆 לוח המובילים — השבוע',  en: '🏆 Leaderboard - this week' },
  'comm.no_group':           { he: 'עדיין אין לך קבוצה',      en: "You don't have a group yet" },
  'comm.no_group_sub':       { he: 'צור קבוצה פרטית עם המשפחה', en: 'Create a private group with family' },
  'comm.create_join':        { he: 'צור או הצטרף לקבוצה ←',    en: 'Create or join group ←' },

  // קבוצה (08-group)
  'group.title':             { he: '👥 קבוצה שלי',            en: '👥 My Group' },
  'group.loading':           { he: 'טוען...',                 en: 'Loading...' },
  'group.create_new':        { he: '🌟 צור קבוצה חדשה',       en: '🌟 Create new group' },
  'group.or_join':           { he: 'או הצטרף לקבוצה קיימת',   en: 'Or join an existing group' },
  'group.join_placeholder':  { he: 'קוד הצטרפות',             en: 'Join code' },
  'group.join_btn':          { he: 'הצטרף',                   en: 'Join' },
  'group.create_title':      { he: 'צור קבוצה חדשה',          en: 'Create a new group' },
  'group.create_sub':        { he: 'בחר שם לקבוצה ואת השם שלך שיופיע לחברים.', en: 'Choose group name and your name to display.' },
  'group.name_label':        { he: 'שם הקבוצה',               en: 'Group name' },
  'group.name_placeholder':  { he: 'למשל: "משפחת לוי" או "חברותא שלנו"', en: 'e.g. "Levy Family" or "Study Partners"' },
  'group.my_name_label':     { he: 'השם שלי בקבוצה',          en: 'My name in group' },
  'group.my_name_placeholder': { he: 'למשל: "אבא" או "ישראל"', en: 'e.g. "Dad" or "Israel"' },
  'group.create_btn':        { he: 'צור קבוצה ←',             en: 'Create group ←' },
  'group.back':              { he: '← חזרה',                  en: '← Back' },
  'group.share_invite':      { he: '🔗 שתף הזמנה',             en: '🔗 Share invitation' },
  'group.members':           { he: 'חברי הקבוצה',             en: 'Group members' },
  'group.mission':           { he: '📖 מבצע משותף',           en: '📖 Joint Mission' },
  'group.leave':             { he: '↩ עזוב קבוצה',            en: '↩ Leave group' },
  'group.new_challenge':     { he: '➕ אתגר חדש',              en: '➕ New challenge' },
  'group.pick_chunk':        { he: '📌 בחר נתח שלי',           en: '📌 Pick my chunk' },

  // יזכור (05-yizkor)
  'yizkor.title':            { he: '🕯 לרפואה / לנשמה',        en: '🕯 Health / Memorial' },
  'yizkor.refua':            { he: 'לרפואה שלמה',             en: 'For full recovery' },
  'yizkor.neshama':          { he: 'לעילוי נשמה',             en: 'For soul elevation' },

  // פסוקים שמורים (09-saved)
  'saved.title':             { he: '🔖 משניות שמורות',         en: '🔖 Saved Mishnayot' },
  'saved.empty':             { he: 'אין עדיין משניות שמורות', en: 'No saved mishnayot yet' },
  'saved.delete':            { he: 'מחק',                     en: 'Delete' },

  // מחולל רצף (10-sequence)
  'seq.title':               { he: '🎼 מחולל רצף פרקים',       en: '🎼 Sequence Builder' },
  'seq.back':                { he: '› חזרה',                  en: '› Back' },
  'seq.chapters':            { he: 'פרקים',                   en: 'chapters' },
  'seq.yomit':               { he: '📅 משנה יומית',           en: '📅 Daily Mishnah' },
  'seq.favs':                { he: '❤️ מועדפים',              en: '❤️ Favorites' },
  'seq.avot':                { he: '✡ פרקי אבות',            en: '✡ Pirkei Avot' },
  'seq.clear':               { he: '✕ נקה',                   en: '✕ Clear' },
  'seq.hint':                { he: 'בחר סדר ← מסכת, ולחץ על פרק להוסיפו לרצף · לחץ שנית להסירו', en: 'Pick an order → tractate, then tap a chapter to add · tap again to remove' },
  'seq.add_tractate':        { he: '+ כל המסכת',              en: '+ Whole tractate' },
  'seq.order':               { he: 'סדר הקריאה:',             en: 'Reading order:' },
  'seq.cancel_all':          { he: '✕ בטל הכל',                en: '✕ Cancel all' },
  'seq.empty':               { he: 'טרם נבחרו פרקים',          en: 'No chapters selected' },
  'seq.start_btn':           { he: '▶ קרא ברצף',              en: '▶ Read sequence' },

  // טקסטים כלליים
  'common.cancel':           { he: 'ביטול',                   en: 'Cancel' },
  'common.save':             { he: 'שמור',                    en: 'Save' },
  'common.delete':           { he: 'מחק',                     en: 'Delete' },
  'common.close':            { he: 'סגור',                    en: 'Close' },
  'common.yes':              { he: 'כן',                      en: 'Yes' },
  'common.no':               { he: 'לא',                      en: 'No' },
  'common.confirm':          { he: 'אישור',                   en: 'Confirm' },
  'common.loading':          { he: 'טוען...',                 en: 'Loading...' },
  'common.empty':            { he: 'ריק',                     en: 'Empty' },
  'common.next':             { he: 'הבא',                     en: 'Next' },
  'common.prev':             { he: 'הקודם',                   en: 'Previous' },

  // תוספות 2.1.2 — תרגומים חסרים
  'graph.minutes_today':     { he: 'דק׳ היום',                en: 'min today' },
  'graph.maalot_today':      { he: 'זכויות היום',              en: 'zechuyot today' },
  'home.refresh_challenges': { he: '🔄 רענן',                  en: '🔄 Refresh' },
  'reader.continue':         { he: 'סיום וחזרה',              en: "I\u2019m Done" },
  'reader.done_short':       { he: 'סיימתי פרק',              en: 'Chapter complete' },
  'reader.back_short':       { he: '← בית',                   en: '← Home' },
  'reader.show_endings':     { he: 'הסתר סיומות',             en: 'Hide endings' },
  'reader.show_endings_on':  { he: 'הצג סיומות',              en: 'Show endings' },
  'reader.shinun_btn':       { he: '🧠 שינון',                en: '🧠 Practice' },
  'reader.share_chap':       { he: '📤 שתף',                  en: '📤 Share' },
  'reader.save_btn':         { he: '🔖 שמור',                 en: '🔖 Save' },
  'reader.font_smaller':     { he: 'א-',                       en: 'A-' },
  'reader.font_bigger':      { he: 'א+',                       en: 'A+' },
  'hist.no_data':            { he: 'אין עדיין היסטוריה.',     en: 'No history yet.' },
  'hist.no_today':           { he: 'לא קראת עדיין היום',      en: 'No reading today yet' },
  'hist.tap_to_start':       { he: 'פתח פרק ותתחיל!',         en: 'Open a chapter and start!' },
  'hist.medals_sub':         { he: 'מדליה לכל פרק לפי משך קריאה', en: 'Medal per chapter by duration' },
  'hist.yesterday':          { he: '📆 אתמול',                    en: '📆 Yesterday' },
  'hist.period_summary':     { he: 'סיכום תקופה',                 en: 'Period summary' },
  'hist.lstat_streak':       { he: 'רצף ימים',                    en: 'Day streak' },
  'hist.lstat_mem':          { he: 'בעל פה',                      en: 'By heart' },
  'hist.streak_cal_title':   { he: '🔥 רצף קריאה — 28 ימים',     en: '🔥 Reading streak — 28 days' },
  'hist.cal_none':           { he: 'לא נקרא',                     en: 'Not read' },
  'hist.cal_many':           { he: 'הרבה',                        en: 'A lot' },
  'hist.cal_shabbat':        { he: 'שישי/שבת',                    en: 'Fri/Sat' },
  'hist.legend_box_title':   { he: '📊 מקרא — איך צוברים זכויות?', en: '📊 How to earn Zechuyot?' },

  // קהילה — תוספות (07-community)
  'comm.today_stat':         { he: '📅 היום',                         en: '📅 Today' },
  'comm.gs_chaps':           { he: '📖 פרקים<br>היום',               en: '📖 Chapters<br>today' },
  'comm.gs_mins':            { he: '⏱ דקות<br>היום',                 en: '⏱ Minutes<br>today' },
  'comm.gs_score':           { he: '⭐ סה״כ<br>זכויות',               en: '⭐ Total<br>Zechuyot' },
  'comm.group_lb':           { he: 'לוח מובילים — הקבוצה',           en: 'Group leaderboard' },
  'comm.mission_title':      { he: '📖 מבצע משותף',                  en: '📖 Joint mission' },
  'comm.mission_sub':        { he: 'סיום המשנה יחד',             en: 'Finish the Mishnah together' },
  'comm.out_of_150':         { he: 'מתוך 150',                       en: 'out of 150' },
  'comm.manage_group':       { he: '⚙️ נהל / הצטרף לקבוצה ←',       en: '⚙️ Manage / join group ←' },

  // קבוצות — תוספות (08-group)
  'group.list_title':        { he: '👥 הקבוצות שלי',                 en: '👥 My Groups' },
  'group.list_sub':          { he: 'למד משניות יחד עם משפחה, חברים וחברותא', en: 'Study Mishnah together with family, friends & chavruta' },
  'group.create_btn':        { he: '➕ צור קבוצה חדשה',              en: '➕ Create new group' },
  'group.join_btn2':         { he: 'הצטרף ›',                        en: 'Join ›' },
  'group.type_family':       { he: 'משפחה',                          en: 'Family' },
  'group.type_friends':      { he: 'חברים',                          en: 'Friends' },
  'group.type_chavruta':     { he: 'חברותא',                         en: 'Chavruta' },
  'group.type_work':         { he: 'עבודה / ארגון',                  en: 'Work / Organization' },
  'group.back_list':         { he: '← חזרה לרשימה',                 en: '← Back to list' },
  'group.all_groups':        { he: '← כל הקבוצות',                  en: '← All groups' },
  'group.share_invite':      { he: '🔗 שתף הזמנה',                   en: '🔗 Share invitation' },
  'group.members_label':     { he: 'חברי הקבוצה',                    en: 'Group members' },
  'group.type_section':      { he: 'סוג הקבוצה',                     en: 'Group type' },
  'group.create_btn_submit': { he: 'צור קבוצה ←',                    en: 'Create group ←' },
  'group.new_challenge_btn': { he: '➕ אתגר חדש',                    en: '➕ New challenge' },
  'group.pick_chunk_btn':    { he: '📌 בחר נתח שלי',                 en: '📌 Pick my chunk' },
  'group.chunk_instructions':{ he: 'לחץ על פרקים כדי "לקחת" אותם. פרק שנלקח על ידי חבר אחר — לא ניתן לקחת.', en: 'Tap chapters to claim them. A chapter claimed by another member cannot be taken.' },
  'group.cancel':            { he: 'ביטול',                          en: 'Cancel' },
  'group.leave':             { he: '↩ עזוב קבוצה',                   en: '↩ Leave group' },

  // אזכרה ורפואה (05-yizkor)
  'yizkor.back':            { he: '← חזרה',                                    en: '← Back' },
  'yizkor.home':            { he: '← חזרה לדף הבית',                           en: '← Back to home' },
  'yizkor.mode_ref':        { he: '💙<br>רפואה',                               en: '💙<br>Health' },
  'yizkor.mode_nsh':        { he: '✡️<br>עילוי נשמה',                           en: '✡️<br>In memory' },
  'yizkor.mode_azk':        { he: '🕯️<br>אזכרה',                              en: '🕯️<br>Yahrzeit' },
  'yizkor.mother_name':     { he: 'שם האם (לנוסח מי שבירך — אם ידוע)',          en: "Mother's name (for Mi Sheberach — if known)" },
  'yizkor.male':            { he: 'בן (זכר)',                                  en: 'Son (male)' },
  'yizkor.female':          { he: 'בת (נקבה)',                                 en: 'Daughter (female)' },
  'yizkor.reading_type':    { he: 'סוג קריאה',                                 en: 'Reading type' },
  'yizkor.by_letters':      { he: '📖 לפי אותיות השם',                          en: '📖 By name letters' },
  'yizkor.by_psalm':        { he: '🔢 פרק לבחירה',                             en: '🔢 Choose psalm' },
  'yizkor.common_psalms':   { he: 'פרקים נפוצים לעילוי נשמה',                   en: 'Common psalms for memorial' },
  'yizkor.reading_order':   { he: 'סדר הקריאה שייווצר',                          en: 'Reading order to be created' },
  'yizkor.font_size':       { he: 'גודל גופן',                                  en: 'Font size' },
  'yizkor.prev':            { he: '→ הקודם',                                   en: '→ Previous' },
  'yizkor.next':            { he: 'הבא ←',                                    en: 'Next ←' },
  'yizkor.prayers':         { he: 'תפילות',                                    en: 'Prayers' },
  'yizkor.done':            { he: 'הקריאה הושלמה!',                            en: 'Reading completed!' },
  'yizkor.ph_name':         { he: 'הכנס שם בעברית...',                          en: 'Enter Hebrew name...' },
  'yizkor.ph_mother':       { he: 'שם האם בעברית...',                           en: "Mother's Hebrew name..." },
  'yizkor.ph_psalm':        { he: 'או הכנס שם מסכת ופרק…',                       en: 'Or enter a tractate and chapter…' },
  'yizkor.share_request':   { he: '💬 שתף בקשה ללימוד משנה',                    en: '💬 Share Mishnah Study Request' },
  'yizkor.to_prayers':      { he: 'לתפילות ✨',                                  en: 'To Prayers ✨' },
  'yizkor.role_pre':        { he: 'משניות לפני השם',                             en: 'Mishnayot before name' },
  'yizkor.role_name':       { he: 'לפי אותיות השם',                              en: 'By name letters' },
  'yizkor.role_neshamah':   { he: 'אותיות נשמה',                                 en: 'Neshamah letters' },

  // קורא (03-reader)
  'read.back':              { he: '← בית',                                    en: '← Home' },
  'read.commentary':        { he: 'פירוש',                                     en: 'Commentary' },
  'read.favorite':          { he: 'מועדף',                                     en: 'Favorite' },
  'read.memorize':          { he: 'שינון',                                     en: 'Memorize' },
  'read.shinun_mode':       { he: 'מצב שינון',                                 en: 'Memorize mode' },
  'read.prev_chap':         { he: 'פרק קודם',                                  en: 'Previous chapter' },
  'read.next_chap':         { he: 'פרק הבא',                                   en: 'Next chapter' },
  'read.end_dedication':    { he: 'סיים הקדשה',                                en: 'End dedication' },
  'read.auto_scroll':       { he: 'גלילה אוטו׳',                               en: 'Auto scroll' },
  'read.shinun_review':     { he: '📖<br>חזרה',                               en: '📖<br>Review' },
  'read.shinun_hide_ends':  { he: '🔲<br>הסתר סיומות',                         en: '🔲<br>Hide endings' },
  'read.shinun_rashei':     { he: '🔡<br>ראשי תיבות',                          en: '🔡<br>First letters' },
  'read.shinun_blanks':     { he: '⬚<br>השלמת מילים',                          en: '⬚<br>Fill blanks' },
  'read.shinun_hint':       { he: '💡<br>רמז ראשון',                           en: '💡<br>First hint' },
  'read.shinun_test':       { he: '🎯<br>מבחן',                               en: '🎯<br>Test' },
  'read.loading':           { he: 'טוען פרק...',                               en: 'Loading chapter...' },
  'read.idle_warning':      { he: '⏸ הטיימר נעצר — עבור לפרק הבא כדי להמשיך', en: '⏸ Timer paused — go to next chapter to continue' },
  'read.finish_home':       { he: 'סיום 🏠',                                  en: 'Finish 🏠' },
  'read.next_chap_btn':     { he: 'פרק הבא ←',                               en: 'Next chapter ←' },

  'comm.no_group_btn':       { he: 'צור או הצטרף לקבוצה ←',    en: 'Create or join group ←' },
  'comm.go_group':           { he: '⚙️ נהל את הקבוצה ←',       en: '⚙️ Manage group ←' },
  'comm.no_group_sub_long':  { he: 'צור קבוצה פרטית עם המשפחה<br>וראה את ההישגים שלכם יחד.', en: 'Create a private group with family<br>and see achievements together.' },
  'group.copy_code':         { he: '📋 העתק קוד',              en: '📋 Copy code' },
  'group.code_copied':       { he: '✅ הקוד הועתק',            en: '✅ Code copied' },
  'group.invitation_text':   { he: 'הזמנה',                    en: 'Invitation' },
  'group.new_challenge_title': { he: '🎯 אתגר חדש לקבוצה',     en: '🎯 New group challenge' },
  'group.challenge_type':    { he: 'סוג האתגר',                en: 'Challenge type' },
  'group.book_label':        { he: 'בחר סדר',                  en: 'Select order' },
  'group.tractate_label':    { he: 'בחר מסכת',                 en: 'Select tractate' },
  'group.deadline':          { he: 'תאריך יעד (אופציונלי)',    en: 'Deadline (optional)' },
  'group.create_challenge':  { he: 'צור אתגר',                 en: 'Create challenge' },
  'group.pick_chunk_title':  { he: '📌 בחר נתח לעצמך',         en: '📌 Pick your chunk' },
  'group.save_btn':          { he: 'שמור',                     en: 'Save' },
  'group.type_book':         { he: 'סדר שלם מתוך 6 סדרי המשנה', en: 'A whole order (of the 6)' },
  'group.type_tractate':     { he: 'מסכת שלמה',               en: 'A whole tractate' },
  'group.type_all':          { he: 'כל 525 הפרקים',            en: 'All 525 chapters' },
  'group.type_day':          { he: 'המשנה היומית',            en: "Today's Mishnah" },
  'sel.daily_song_sub':      { he: 'למד עכשיו ←',             en: 'Study now ←' },
  'sel.cycle_continue':      { he: 'ממשיך מהמקום שעצרת',      en: 'Continue from where you stopped' },
  'sel.cycle_start':         { he: 'מתחיל מפרק א׳',            en: 'Start from chapter 1' },
  'sel.sequence_create':     { he: 'צור רצף משלך ←',          en: 'Create your sequence ←' },
  'seq.reset':               { he: '↻ אפס',                   en: '↻ Reset' },
  'seq.added_to_seq':        { he: 'נוסף לרצף',                en: 'Added to sequence' },
  'set.lang_choose':         { he: 'בחר שפה',                  en: 'Choose language' },
  // יזכור
  'yiz.refua_title':         { he: '💚 לרפואה שלמה',           en: '💚 For full recovery' },
  'yiz.neshama_title':       { he: '🕯 לעילוי נשמה',            en: '🕯 For soul elevation' },
  'yiz.name_label':          { he: 'שם החולה / המנוח',         en: 'Name of patient / deceased' },
  'yiz.mother_label':        { he: 'שם האם / אבא',             en: 'Name of mother / father' },
  // פסוקים שמורים
  'saved.empty_state':       { he: 'אין פסוקים שמורים עדיין.\nלחץ ארוך על פסוק בקריאה כדי לשמור.', en: 'No saved mishnayot yet.\nLong-press a verse to save.' },
  'saved.share':             { he: '📤 שתף',                  en: '📤 Share' },
  'saved.copy':              { he: '📋 העתק',                 en: '📋 Copy' },
  'saved.remove':            { he: '🗑 הסר',                   en: '🗑 Remove' }
};

function getCurrentLang() {
  try {
    const s = JSON.parse(localStorage.getItem('tehillim_settings')) || {};
    return s.lang || 'he';
  } catch(e) { return 'he'; }
}

function setLang(lang) {
  try {
    const s = JSON.parse(localStorage.getItem('tehillim_settings')) || {};
    s.lang = lang;
    localStorage.setItem('tehillim_settings', JSON.stringify(s));
  } catch(e) {}
}

function t(key, fallback) {
  const lang = getCurrentLang();
  const entry = DICT[key];
  if (!entry) return fallback || key;
  return entry[lang] || entry.he || fallback || key;
}

// applyTranslations: סורק את הדף ומחליף טקסטים לפי data-i18n
function applyTranslations() {
  const lang = getCurrentLang();
  // עדכן את כיוון הדף ועוד דברים גלובליים
  if (lang === 'en') {
    document.documentElement.setAttribute('lang', 'en');
    document.documentElement.setAttribute('dir', 'rtl'); // נשאיר RTL כי תוכן הפרקים בעברית
    document.body && document.body.classList.add('lang-en');
  } else {
    document.documentElement.setAttribute('lang', 'he');
    document.documentElement.setAttribute('dir', 'rtl');
    document.body && document.body.classList.remove('lang-en');
  }
  // החלף כל אלמנט עם data-i18n
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    const key = el.getAttribute('data-i18n');
    const val = t(key);
    if (val) el.innerHTML = val;
  });
  // החלף placeholder עם data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
    const key = el.getAttribute('data-i18n-placeholder');
    el.setAttribute('placeholder', t(key));
  });
  // החלף title/aria-label
  document.querySelectorAll('[data-i18n-title]').forEach(function(el) {
    const key = el.getAttribute('data-i18n-title');
    el.setAttribute('title', t(key));
    el.setAttribute('aria-label', t(key));
  });
}

global.i18n = {
  t: t,
  getCurrentLang: getCurrentLang,
  setLang: setLang,
  applyTranslations: applyTranslations,
  DICT: DICT
};

// זיהוי שפה: 1) ?lang= בURL, 2) שפת דפדפן בכניסה ראשונה
(function() {
  try {
    const s = JSON.parse(localStorage.getItem('tehillim_settings') || '{}');
    // עדיפות ראשונה: פרמטר URL (מלינק שיתוף)
    const urlLang = new URLSearchParams(location.search).get('lang');
    if (urlLang === 'en' || urlLang === 'he') {
      if (s.lang !== urlLang) { s.lang = urlLang; localStorage.setItem('tehillim_settings', JSON.stringify(s)); }
      return;
    }
    // עדיפות שנייה: זיהוי שפת דפדפן בכניסה ראשונה (לפני שהמשתמש בחר שפה)
    if (!s.lang) {
      const bl = (navigator.language || 'he').toLowerCase();
      s.lang = bl.startsWith('he') ? 'he' : 'en';
      localStorage.setItem('tehillim_settings', JSON.stringify(s));
    }
  } catch(e) {}
})();

// אתחול אוטומטי
if (document.readyState !== 'loading') {
  setTimeout(applyTranslations, 0);
} else {
  document.addEventListener('DOMContentLoaded', applyTranslations);
}

})(window);
