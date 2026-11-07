// Nadaku — content made for Indonesian speakers.
// LOANWORDS: Indonesian words borrowed from Hokkien (source: Wikipedia, "List of Chinese loanwords in Indonesian"),
// with the Mandarin word to use today. TRAPS: pinyin spellings that Indonesian readers tend to misread.
const LOANWORDS = [
 {
  "indo": "bakmi",
  "src": "肉面",
  "hok": "bah-mī",
  "zh": "面条",
  "py": "miàn tiáo",
  "hsk": 0,
  "id": "mi daging",
  "en": "meat noodles"
 },
 {
  "indo": "bakpao",
  "src": "肉包",
  "hok": "bah-pâu",
  "zh": "包子",
  "py": "bāo zi",
  "hsk": 1,
  "id": "bakpao isi daging",
  "en": "meat bun"
 },
 {
  "indo": "cawan",
  "src": "茶碗",
  "hok": "tê-oáⁿ",
  "zh": "茶碗",
  "py": "chá wǎn",
  "hsk": 0,
  "id": "mangkuk/cangkir teh",
  "en": "tea bowl/cup"
 },
 {
  "indo": "ceban",
  "src": "一万",
  "hok": "chi̍t-bān",
  "zh": "一万",
  "py": "yī wàn",
  "hsk": 0,
  "id": "sepuluh ribu",
  "en": "ten thousand"
 },
 {
  "indo": "cengbeng",
  "src": "清明",
  "hok": "chheng-bêng",
  "zh": "清明节",
  "py": "Qīng míng jié",
  "hsk": 6,
  "id": "hari ziarah kubur",
  "en": "Tomb-Sweeping Day"
 },
 {
  "indo": "cepek",
  "src": "一百",
  "hok": "chi̍t-pah",
  "zh": "一百",
  "py": "yī bǎi",
  "hsk": 0,
  "id": "seratus",
  "en": "one hundred"
 },
 {
  "indo": "cici",
  "src": "姐姐",
  "hok": "chiá-chiá",
  "zh": "姐姐",
  "py": "jiě jie",
  "hsk": 1,
  "id": "kakak perempuan",
  "en": "elder sister"
 },
 {
  "indo": "hoki",
  "src": "福气",
  "hok": "hok-khì",
  "zh": "福气",
  "py": "fú qi",
  "hsk": 0,
  "id": "keberuntungan",
  "en": "good fortune"
 },
 {
  "indo": "kamsia",
  "src": "感谢",
  "hok": "kám-siā",
  "zh": "感谢",
  "py": "gǎn xiè",
  "hsk": 2,
  "id": "terima kasih",
  "en": "thank you"
 },
 {
  "indo": "kongsi",
  "src": "公司",
  "hok": "kong-si",
  "zh": "公司",
  "py": "gōng sī",
  "hsk": 2,
  "id": "perusahaan",
  "en": "company"
 },
 {
  "indo": "kuaci",
  "src": "瓜子",
  "hok": "koa-chí",
  "zh": "瓜子",
  "py": "guā zǐ",
  "hsk": 0,
  "id": "kuaci",
  "en": "melon seeds"
 },
 {
  "indo": "lihai",
  "src": "厉害",
  "hok": "lī-hāi",
  "zh": "厉害",
  "py": "lì hai",
  "hsk": 5,
  "id": "hebat",
  "en": "formidable, skilful"
 },
 {
  "indo": "loteng",
  "src": "楼顶",
  "hok": "lâu-téng",
  "zh": "楼上",
  "py": "lóu shàng",
  "hsk": 1,
  "id": "lantai atas",
  "en": "upstairs"
 },
 {
  "indo": "tauke",
  "src": "头家",
  "hok": "thâu-ke",
  "zh": "老板",
  "py": "lǎo bǎn",
  "hsk": 3,
  "id": "bos, pemilik toko",
  "en": "boss, owner"
 },
 {
  "indo": "teko",
  "src": "茶壶",
  "hok": "tê-kó͘",
  "zh": "茶壶",
  "py": "chá hú",
  "hsk": 0,
  "id": "teko",
  "en": "teapot"
 }
];
const PINYIN_TRAPS = [
 {
  "key": "c",
  "words": [
   "菜",
   "草",
   "次"
  ],
  "id": "Pinyin c dibaca \"ts\" dengan hembusan (seperti \"ts\" pada \"its\"), BUKAN c Indonesia (cari).",
  "en": "Pinyin c is \"ts\" with a puff of air (like \"its\"), NOT the Indonesian c in \"cari\"."
 },
 {
  "key": "q",
  "words": [
   "七",
   "去",
   "钱"
  ],
  "id": "Pinyin q paling mirip c Indonesia (cari), tapi dengan hembusan napas dan lidah datar.",
  "en": "Pinyin q is closest to the Indonesian c (cari), but with a puff of air and a flat tongue."
 },
 {
  "key": "x",
  "words": [
   "学",
   "小",
   "西"
  ],
  "id": "Pinyin x terdengar di antara \"s\" dan \"sy\" — ujung lidah di belakang gigi bawah.",
  "en": "Pinyin x sounds between \"s\" and \"sy\" — tongue tip behind the lower teeth."
 },
 {
  "key": "zh ch sh r",
  "words": [
   "中",
   "吃",
   "是",
   "热"
  ],
  "id": "zh, ch, sh, r: ujung lidah ditekuk sedikit ke belakang (retrofleks). Tidak ada di bahasa Indonesia.",
  "en": "zh, ch, sh, r: curl the tongue tip slightly back (retroflex). Indonesian has no such sounds."
 },
 {
  "key": "z",
  "words": [
   "再",
   "字",
   "早"
  ],
  "id": "Pinyin z = \"ts\" tanpa hembusan (pasangan lembut dari c). Bukan z Indonesia (zaman).",
  "en": "Pinyin z = \"ts\" without a puff of air (the soft partner of c). Not the Indonesian z in \"zaman\"."
 },
 {
  "key": "b/p d/t g/k",
  "words": [
   "爸",
   "怕",
   "大",
   "他",
   "哥",
   "可"
  ],
  "id": "Bedanya hembusan, bukan getar suara: p, t, k menghembus kuat (tes dengan kertas tipis di depan mulut); b, d, g tanpa hembusan dan lebih lembut dari b, d, g Indonesia.",
  "en": "The difference is breath, not voicing: p, t, k have a strong puff (test with thin paper in front of your mouth); b, d, g have none and are softer than Indonesian b, d, g."
 },
 {
  "key": "ü",
  "words": [
   "女",
   "绿",
   "鱼",
   "去"
  ],
  "id": "ü: ucapkan \"i\" lalu bulatkan bibir seperti \"u\". Setelah j, q, x, y titiknya tidak ditulis (去 qù tetap ü).",
  "en": "ü: say \"i\" and round your lips as for \"u\". After j, q, x, y the dots are dropped (去 qù is still ü)."
 },
 {
  "key": "e",
  "words": [
   "饿",
   "喝",
   "热"
  ],
  "id": "Pinyin e bukan e pada \"enak\". Mirip e pepet (\"emas\") tetapi lebih ke belakang tenggorokan.",
  "en": "Pinyin e is not the e of \"enak\". Close to the schwa in \"emas\", but further back in the throat."
 },
 {
  "key": "-i",
  "words": [
   "是",
   "四",
   "日",
   "字"
  ],
  "id": "Setelah z, c, s, zh, ch, sh, r huruf i BUKAN \"i\" (ini) — lidah tetap di posisi konsonan, suaranya mendengung.",
  "en": "After z, c, s, zh, ch, sh, r the letter i is NOT \"i\" — the tongue stays in the consonant position and buzzes."
 },
 {
  "key": "ian",
  "words": [
   "天",
   "钱",
   "面"
  ],
  "id": "ian dibaca \"yen\", bukan \"yan\": 天 tiān ≈ \"tien\".",
  "en": "ian sounds like \"yen\", not \"yan\": 天 tiān ≈ \"tien\"."
 },
 {
  "key": "nada",
  "words": [
   "买",
   "卖"
  ],
  "id": "Bahasa Indonesia tidak bernada, jadi nada mudah terlewat: 买 mǎi = beli, 卖 mài = jual. Jangan menaikkan nada di akhir kalimat tanya; pakai 吗 ma.",
  "en": "Indonesian has no lexical tones, so they are easy to miss: 买 mǎi = buy, 卖 mài = sell. Don't raise your pitch at the end of a question; use 吗 ma."
 }
];
