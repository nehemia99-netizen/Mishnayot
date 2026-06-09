/* ============================================================
 * corpus.js — מבנה המשנה (משנתי)
 * נוצר אוטומטית מ-Sefaria shape API (api/shape/Mishnah).
 * לרענון: gen_corpus.py במרחב העבודה. אין לערוך ידנית.
 * נוצר: 2026-06-02
 * סדרים: 6 | מסכתות: 63 | פרקים: 525 | משניות: 4192
 * ============================================================ */
(function(global){
  "use strict";

  var ORDERS = [{"id": "Zeraim", "he": "זרעים", "tractates": ["Berakhot", "Peah", "Demai", "Kilayim", "Sheviit", "Terumot", "Maasrot", "MaaserSheni", "Challah", "Orlah", "Bikkurim"]}, {"id": "Moed", "he": "מועד", "tractates": ["Shabbat", "Eruvin", "Pesachim", "Shekalim", "Yoma", "Sukkah", "Beitzah", "RoshHashanah", "Taanit", "Megillah", "MoedKatan", "Chagigah"]}, {"id": "Nashim", "he": "נשים", "tractates": ["Yevamot", "Ketubot", "Nedarim", "Nazir", "Sotah", "Gittin", "Kiddushin"]}, {"id": "Nezikin", "he": "נזיקין", "tractates": ["BavaKamma", "BavaMetzia", "BavaBatra", "Sanhedrin", "Makkot", "Shevuot", "Eduyot", "AvodahZarah", "PirkeiAvot", "Horayot"]}, {"id": "Kodashim", "he": "קדשים", "tractates": ["Zevachim", "Menachot", "Chullin", "Bekhorot", "Arakhin", "Temurah", "Keritot", "Meilah", "Tamid", "Middot", "Kinnim"]}, {"id": "Tahorot", "he": "טהרות", "tractates": ["Kelim", "Oholot", "Negaim", "Parah", "Tahorot", "Mikvaot", "Niddah", "Makhshirin", "Zavim", "TevulYom", "Yadayim", "Oktzin"]}];

  var TRACTATES = [
    {"id": "Berakhot", "he": "ברכות", "heFull": "משנה ברכות", "slug": "Mishnah_Berakhot", "order": "Zeraim", "length": 9, "perakim": [5, 8, 6, 7, 5, 8, 5, 8, 5], "total": 57},
    {"id": "Peah", "he": "פאה", "heFull": "משנה פאה", "slug": "Mishnah_Peah", "order": "Zeraim", "length": 8, "perakim": [6, 8, 8, 11, 8, 11, 8, 9], "total": 69},
    {"id": "Demai", "he": "דמאי", "heFull": "משנה דמאי", "slug": "Mishnah_Demai", "order": "Zeraim", "length": 7, "perakim": [4, 5, 6, 7, 11, 12, 8], "total": 53},
    {"id": "Kilayim", "he": "כלאים", "heFull": "משנה כלאים", "slug": "Mishnah_Kilayim", "order": "Zeraim", "length": 9, "perakim": [9, 11, 7, 9, 8, 9, 8, 6, 10], "total": 77},
    {"id": "Sheviit", "he": "שביעית", "heFull": "משנה שביעית", "slug": "Mishnah_Sheviit", "order": "Zeraim", "length": 10, "perakim": [8, 10, 10, 10, 9, 6, 7, 11, 9, 9], "total": 89},
    {"id": "Terumot", "he": "תרומות", "heFull": "משנה תרומות", "slug": "Mishnah_Terumot", "order": "Zeraim", "length": 11, "perakim": [10, 6, 9, 13, 9, 6, 7, 12, 7, 12, 10], "total": 101},
    {"id": "Maasrot", "he": "מעשרות", "heFull": "משנה מעשרות", "slug": "Mishnah_Maasrot", "order": "Zeraim", "length": 5, "perakim": [8, 8, 10, 6, 8], "total": 40},
    {"id": "MaaserSheni", "he": "מעשר שני", "heFull": "משנה מעשר שני", "slug": "Mishnah_Maaser_Sheni", "order": "Zeraim", "length": 5, "perakim": [7, 10, 13, 12, 15], "total": 57},
    {"id": "Challah", "he": "חלה", "heFull": "משנה חלה", "slug": "Mishnah_Challah", "order": "Zeraim", "length": 4, "perakim": [9, 8, 10, 11], "total": 38},
    {"id": "Orlah", "he": "ערלה", "heFull": "משנה ערלה", "slug": "Mishnah_Orlah", "order": "Zeraim", "length": 3, "perakim": [9, 17, 9], "total": 35},
    {"id": "Bikkurim", "he": "ביכורים", "heFull": "משנה ביכורים", "slug": "Mishnah_Bikkurim", "order": "Zeraim", "length": 4, "perakim": [11, 11, 12, 5], "total": 39},
    {"id": "Shabbat", "he": "שבת", "heFull": "משנה שבת", "slug": "Mishnah_Shabbat", "order": "Moed", "length": 24, "perakim": [11, 7, 6, 2, 4, 10, 4, 7, 7, 6, 6, 6, 7, 4, 3, 8, 8, 3, 6, 5, 3, 6, 5, 5], "total": 139},
    {"id": "Eruvin", "he": "עירובין", "heFull": "משנה עירובין", "slug": "Mishnah_Eruvin", "order": "Moed", "length": 10, "perakim": [10, 6, 9, 11, 9, 10, 11, 11, 4, 15], "total": 96},
    {"id": "Pesachim", "he": "פסחים", "heFull": "משנה פסחים", "slug": "Mishnah_Pesachim", "order": "Moed", "length": 10, "perakim": [7, 8, 8, 9, 10, 6, 13, 8, 11, 9], "total": 89},
    {"id": "Shekalim", "he": "שקלים", "heFull": "משנה שקלים", "slug": "Mishnah_Shekalim", "order": "Moed", "length": 8, "perakim": [7, 5, 4, 9, 6, 6, 7, 8], "total": 52},
    {"id": "Yoma", "he": "יומא", "heFull": "משנה יומא", "slug": "Mishnah_Yoma", "order": "Moed", "length": 8, "perakim": [8, 7, 11, 6, 7, 8, 5, 9], "total": 61},
    {"id": "Sukkah", "he": "סוכה", "heFull": "משנה סוכה", "slug": "Mishnah_Sukkah", "order": "Moed", "length": 5, "perakim": [11, 9, 15, 10, 8], "total": 53},
    {"id": "Beitzah", "he": "ביצה", "heFull": "משנה ביצה", "slug": "Mishnah_Beitzah", "order": "Moed", "length": 5, "perakim": [10, 10, 8, 7, 7], "total": 42},
    {"id": "RoshHashanah", "he": "ראש השנה", "heFull": "משנה ראש השנה", "slug": "Mishnah_Rosh_Hashanah", "order": "Moed", "length": 4, "perakim": [9, 9, 8, 9], "total": 35},
    {"id": "Taanit", "he": "תענית", "heFull": "משנה תענית", "slug": "Mishnah_Ta'anit", "order": "Moed", "length": 4, "perakim": [7, 10, 9, 8], "total": 34},
    {"id": "Megillah", "he": "מגילה", "heFull": "משנה מגילה", "slug": "Mishnah_Megillah", "order": "Moed", "length": 4, "perakim": [11, 6, 6, 10], "total": 33},
    {"id": "MoedKatan", "he": "מועד קטן", "heFull": "משנה מועד קטן", "slug": "Mishnah_Moed_Katan", "order": "Moed", "length": 3, "perakim": [10, 5, 9], "total": 24},
    {"id": "Chagigah", "he": "חגיגה", "heFull": "משנה חגיגה", "slug": "Mishnah_Chagigah", "order": "Moed", "length": 3, "perakim": [8, 7, 8], "total": 23},
    {"id": "Yevamot", "he": "יבמות", "heFull": "משנה יבמות", "slug": "Mishnah_Yevamot", "order": "Nashim", "length": 16, "perakim": [4, 10, 10, 13, 6, 6, 6, 6, 6, 9, 7, 6, 13, 9, 10, 7], "total": 128},
    {"id": "Ketubot", "he": "כתובות", "heFull": "משנה כתובות", "slug": "Mishnah_Ketubot", "order": "Nashim", "length": 13, "perakim": [10, 10, 9, 12, 9, 7, 10, 8, 9, 6, 6, 4, 11], "total": 111},
    {"id": "Nedarim", "he": "נדרים", "heFull": "משנה נדרים", "slug": "Mishnah_Nedarim", "order": "Nashim", "length": 11, "perakim": [4, 5, 11, 8, 6, 10, 9, 7, 10, 8, 12], "total": 90},
    {"id": "Nazir", "he": "נזיר", "heFull": "משנה נזיר", "slug": "Mishnah_Nazir", "order": "Nashim", "length": 9, "perakim": [7, 10, 7, 7, 7, 11, 4, 2, 5], "total": 60},
    {"id": "Sotah", "he": "סוטה", "heFull": "משנה סוטה", "slug": "Mishnah_Sotah", "order": "Nashim", "length": 9, "perakim": [9, 6, 8, 5, 5, 4, 8, 7, 15], "total": 67},
    {"id": "Gittin", "he": "גיטין", "heFull": "משנה גיטין", "slug": "Mishnah_Gittin", "order": "Nashim", "length": 9, "perakim": [6, 7, 8, 9, 9, 7, 9, 10, 10], "total": 75},
    {"id": "Kiddushin", "he": "קידושין", "heFull": "משנה קידושין", "slug": "Mishnah_Kiddushin", "order": "Nashim", "length": 4, "perakim": [10, 10, 13, 14], "total": 47},
    {"id": "BavaKamma", "he": "בבא קמא", "heFull": "משנה בבא קמא", "slug": "Mishnah_Bava_Kamma", "order": "Nezikin", "length": 10, "perakim": [4, 6, 11, 9, 7, 6, 7, 7, 12, 10], "total": 79},
    {"id": "BavaMetzia", "he": "בבא מציעא", "heFull": "משנה בבא מציעא", "slug": "Mishnah_Bava_Metzia", "order": "Nezikin", "length": 10, "perakim": [8, 11, 12, 12, 11, 8, 11, 9, 13, 6], "total": 101},
    {"id": "BavaBatra", "he": "בבא בתרא", "heFull": "משנה בבא בתרא", "slug": "Mishnah_Bava_Batra", "order": "Nezikin", "length": 10, "perakim": [6, 14, 8, 9, 11, 8, 4, 8, 10, 8], "total": 86},
    {"id": "Sanhedrin", "he": "סנהדרין", "heFull": "משנה סנהדרין", "slug": "Mishnah_Sanhedrin", "order": "Nezikin", "length": 11, "perakim": [6, 5, 8, 5, 5, 6, 11, 7, 6, 6, 6], "total": 71},
    {"id": "Makkot", "he": "מכות", "heFull": "משנה מכות", "slug": "Mishnah_Makkot", "order": "Nezikin", "length": 3, "perakim": [10, 8, 16], "total": 34},
    {"id": "Shevuot", "he": "שבועות", "heFull": "משנה שבועות", "slug": "Mishnah_Shevuot", "order": "Nezikin", "length": 8, "perakim": [7, 5, 11, 13, 5, 7, 8, 6], "total": 62},
    {"id": "Eduyot", "he": "עדיות", "heFull": "משנה עדיות", "slug": "Mishnah_Eduyot", "order": "Nezikin", "length": 8, "perakim": [14, 10, 12, 12, 7, 3, 9, 7], "total": 74},
    {"id": "AvodahZarah", "he": "עבודה זרה", "heFull": "משנה עבודה זרה", "slug": "Mishnah_Avodah_Zarah", "order": "Nezikin", "length": 5, "perakim": [9, 7, 10, 12, 12], "total": 50},
    {"id": "PirkeiAvot", "he": "אבות", "heFull": "משנה אבות", "slug": "Pirkei_Avot", "order": "Nezikin", "length": 6, "perakim": [18, 16, 18, 22, 23, 11], "total": 108},
    {"id": "Horayot", "he": "הוריות", "heFull": "משנה הוריות", "slug": "Mishnah_Horayot", "order": "Nezikin", "length": 3, "perakim": [5, 7, 8], "total": 20},
    {"id": "Zevachim", "he": "זבחים", "heFull": "משנה זבחים", "slug": "Mishnah_Zevachim", "order": "Kodashim", "length": 14, "perakim": [4, 5, 6, 6, 8, 7, 6, 12, 7, 8, 8, 6, 8, 10], "total": 101},
    {"id": "Menachot", "he": "מנחות", "heFull": "משנה מנחות", "slug": "Mishnah_Menachot", "order": "Kodashim", "length": 13, "perakim": [4, 5, 7, 5, 9, 7, 6, 7, 9, 9, 9, 5, 11], "total": 93},
    {"id": "Chullin", "he": "חולין", "heFull": "משנה חולין", "slug": "Mishnah_Chullin", "order": "Kodashim", "length": 12, "perakim": [7, 10, 7, 7, 5, 7, 6, 6, 8, 4, 2, 5], "total": 74},
    {"id": "Bekhorot", "he": "בכורות", "heFull": "משנה בכורות", "slug": "Mishnah_Bekhorot", "order": "Kodashim", "length": 9, "perakim": [7, 9, 4, 10, 6, 12, 7, 10, 8], "total": 73},
    {"id": "Arakhin", "he": "ערכין", "heFull": "משנה ערכין", "slug": "Mishnah_Arakhin", "order": "Kodashim", "length": 9, "perakim": [4, 6, 5, 4, 6, 5, 5, 7, 8], "total": 50},
    {"id": "Temurah", "he": "תמורה", "heFull": "משנה תמורה", "slug": "Mishnah_Temurah", "order": "Kodashim", "length": 7, "perakim": [6, 3, 5, 4, 6, 5, 6], "total": 35},
    {"id": "Keritot", "he": "כריתות", "heFull": "משנה כריתות", "slug": "Mishnah_Keritot", "order": "Kodashim", "length": 6, "perakim": [7, 6, 10, 3, 8, 9], "total": 43},
    {"id": "Meilah", "he": "מעילה", "heFull": "משנה מעילה", "slug": "Mishnah_Meilah", "order": "Kodashim", "length": 6, "perakim": [4, 9, 8, 6, 5, 6], "total": 38},
    {"id": "Tamid", "he": "תמיד", "heFull": "משנה תמיד", "slug": "Mishnah_Tamid", "order": "Kodashim", "length": 7, "perakim": [4, 5, 9, 3, 6, 3, 4], "total": 34},
    {"id": "Middot", "he": "מדות", "heFull": "משנה מדות", "slug": "Mishnah_Middot", "order": "Kodashim", "length": 5, "perakim": [9, 6, 8, 7, 4], "total": 34},
    {"id": "Kinnim", "he": "קינים", "heFull": "משנה קינים", "slug": "Mishnah_Kinnim", "order": "Kodashim", "length": 3, "perakim": [4, 5, 6], "total": 15},
    {"id": "Kelim", "he": "כלים", "heFull": "משנה כלים", "slug": "Mishnah_Kelim", "order": "Tahorot", "length": 30, "perakim": [9, 8, 8, 4, 11, 4, 6, 11, 8, 8, 9, 8, 8, 8, 6, 8, 17, 9, 10, 7, 3, 10, 5, 17, 9, 9, 12, 10, 8, 4], "total": 254},
    {"id": "Oholot", "he": "אהלות", "heFull": "משנה אהלות", "slug": "Mishnah_Oholot", "order": "Tahorot", "length": 18, "perakim": [8, 7, 7, 3, 7, 7, 6, 6, 16, 7, 9, 8, 6, 7, 10, 5, 5, 10], "total": 134},
    {"id": "Negaim", "he": "נגעים", "heFull": "משנה נגעים", "slug": "Mishnah_Negaim", "order": "Tahorot", "length": 14, "perakim": [6, 5, 8, 11, 5, 8, 5, 10, 3, 10, 12, 7, 12, 13], "total": 115},
    {"id": "Parah", "he": "פרה", "heFull": "משנה פרה", "slug": "Mishnah_Parah", "order": "Tahorot", "length": 12, "perakim": [4, 5, 11, 4, 9, 5, 12, 11, 9, 6, 9, 11], "total": 96},
    {"id": "Tahorot", "he": "טהרות", "heFull": "משנה טהרות", "slug": "Mishnah_Tahorot", "order": "Tahorot", "length": 10, "perakim": [9, 8, 8, 13, 9, 10, 9, 9, 9, 8], "total": 92},
    {"id": "Mikvaot", "he": "מקואות", "heFull": "משנה מקואות", "slug": "Mishnah_Mikvaot", "order": "Tahorot", "length": 10, "perakim": [8, 10, 4, 5, 6, 11, 7, 5, 7, 8], "total": 71},
    {"id": "Niddah", "he": "נדה", "heFull": "משנה נדה", "slug": "Mishnah_Niddah", "order": "Tahorot", "length": 10, "perakim": [7, 7, 7, 7, 9, 14, 5, 4, 11, 8], "total": 79},
    {"id": "Makhshirin", "he": "מכשירין", "heFull": "משנה מכשירין", "slug": "Mishnah_Makhshirin", "order": "Tahorot", "length": 6, "perakim": [6, 11, 8, 10, 11, 8], "total": 54},
    {"id": "Zavim", "he": "זבים", "heFull": "משנה זבים", "slug": "Mishnah_Zavim", "order": "Tahorot", "length": 5, "perakim": [6, 4, 3, 7, 12], "total": 32},
    {"id": "TevulYom", "he": "טבול יום", "heFull": "משנה טבול יום", "slug": "Mishnah_Tevul_Yom", "order": "Tahorot", "length": 4, "perakim": [5, 8, 6, 7], "total": 26},
    {"id": "Yadayim", "he": "ידים", "heFull": "משנה ידים", "slug": "Mishnah_Yadayim", "order": "Tahorot", "length": 4, "perakim": [5, 4, 5, 8], "total": 22},
    {"id": "Oktzin", "he": "עוקצים", "heFull": "משנה עוקצים", "slug": "Mishnah_Oktzin", "order": "Tahorot", "length": 3, "perakim": [6, 10, 12], "total": 28},
  ];

  // אינדקס מהיר לפי מזהה מסכת
  var BY_ID = {};
  TRACTATES.forEach(function(t){ BY_ID[t.id] = t; });

  var TOTAL_PERAKIM = 525;
  var TOTAL_MISHNAYOT = 4192;

  // ── עזרים ──
  function getTractate(id){ return BY_ID[id] || null; }
  function getOrder(id){ for(var i=0;i<ORDERS.length;i++){ if(ORDERS[i].id===id) return ORDERS[i]; } return null; }

  // מזהה פרק יציב שמחליף את ה-chap המספרי: "Berakhot.2"
  function chapId(tractateId, perek){ return tractateId + "." + perek; }
  function parseChapId(cid){
    if(typeof cid !== "string") return null;
    var i = cid.lastIndexOf(".");
    if(i < 0) return null;
    return { tractate: cid.slice(0,i), perek: parseInt(cid.slice(i+1),10) };
  }

  // כתובת Sefaria לטקסט הפרק: "Mishnah_Berakhot.2"
  function apiRef(tractateId, perek){
    var t = BY_ID[tractateId]; if(!t) return null;
    return t.slug + "." + perek;
  }
  // כתובת פירוש (ברטנורא כברירת מחדל): "Bartenura_on_Mishnah_Berakhot.2"
  function commentaryRef(tractateId, perek, type){
    var t = BY_ID[tractateId]; if(!t) return null;
    var pre = (type === "tosafot") ? "Ikar_Tosafot_Yom_Tov_on_" : "Bartenura_on_";
    return pre + t.slug + "." + perek;
  }

  // מספר המשניות בפרק נתון
  function mishnayotIn(tractateId, perek){
    var t = BY_ID[tractateId]; if(!t || perek<1 || perek>t.length) return 0;
    return t.perakim[perek-1] || 0;
  }

  // רשימה שטוחה של כל הפרקים לפי סדר קנוני: [{tractate, perek, id, order}]
  function flatChapters(){
    var out = [];
    TRACTATES.forEach(function(t){
      for(var p=1; p<=t.length; p++){ out.push({ tractate:t.id, perek:p, id:chapId(t.id,p), order:t.order }); }
    });
    return out;
  }

  // ניווט לפרק הבא/הקודם — חוצה גבול מסכת
  function nextChapter(tractateId, perek){
    var t = BY_ID[tractateId]; if(!t) return null;
    if(perek < t.length) return { tractate:tractateId, perek:perek+1 };
    var idx = TRACTATES.indexOf(t);
    if(idx < 0 || idx+1 >= TRACTATES.length) return null;
    var nt = TRACTATES[idx+1];
    return { tractate:nt.id, perek:1 };
  }
  function prevChapter(tractateId, perek){
    var t = BY_ID[tractateId]; if(!t) return null;
    if(perek > 1) return { tractate:tractateId, perek:perek-1 };
    var idx = TRACTATES.indexOf(t);
    if(idx <= 0) return null;
    var pt = TRACTATES[idx-1];
    return { tractate:pt.id, perek:pt.length };
  }

  // רשימה שטוחה של כל המשניות לפי סדר קנוני (4192): [{tractate, perek, mishnah, chapId}]
  var _FLAT_M = null;
  function flatMishnayot(){
    if(_FLAT_M) return _FLAT_M;
    var out = [];
    TRACTATES.forEach(function(t){
      for(var p=1; p<=t.length; p++){
        var cnt = t.perakim[p-1] || 0;
        for(var m=1; m<=cnt; m++){ out.push({ tractate:t.id, perek:p, mishnah:m, chapId:chapId(t.id,p) }); }
      }
    });
    _FLAT_M = out; return out;
  }
  // ── משנה יומית (2 משניות ליום) ──
  // עוגן: 2 ביוני 2026 = כלים ח׳:ב׳ (אינדקס 0-based 3240). אומת מול oraita.net (5786-9-17, 5786-9-24).
  var YOMIT_ANCHOR_DAY = Math.floor(Date.UTC(2026,5,2)/86400000);
  var YOMIT_ANCHOR_IDX = 3240;
  function _dayNum(d){ d = d || new Date(); return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())/86400000); }
  function mishnahYomit(date){
    var flat = flatMishnayot(), N = flat.length;
    var days = _dayNum(date) - YOMIT_ANCHOR_DAY;
    var i0 = (((YOMIT_ANCHOR_IDX + 2*days) % N) + N) % N;
    var a = flat[i0], b = flat[(i0+1) % N];
    return { first:a, second:b, sameChap:(a.tractate===b.tractate && a.perek===b.perek) };
  }

  global.Corpus = {
    name: "Mishnah",
    orders: ORDERS,
    tractates: TRACTATES,
    byId: BY_ID,
    totalPerakim: TOTAL_PERAKIM,
    totalMishnayot: TOTAL_MISHNAYOT,
    getTractate: getTractate,
    getOrder: getOrder,
    chapId: chapId,
    parseChapId: parseChapId,
    apiRef: apiRef,
    commentaryRef: commentaryRef,
    mishnayotIn: mishnayotIn,
    flatChapters: flatChapters,
    flatMishnayot: flatMishnayot,
    mishnahYomit: mishnahYomit,
    nextChapter: nextChapter,
    prevChapter: prevChapter
  };
})(typeof window !== "undefined" ? window : this);
