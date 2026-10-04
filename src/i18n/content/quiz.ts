import { seedModules } from "@/lib/seed-data";
import type { Locale } from "../config";
import type { QuizT } from "./types";

type Translation = [string, string[]];
const zh: Record<number, Translation[]> = {
  1: [
    ["“Merveilleux”是什么意思？", ["神秘", "美妙", "现代", "矿物"]],
    ["我们的配方按什么标准开发？", ["没有特定标准", "法国化妆品标准", "家庭自制", "仅限食品级"]],
    ["哪项最符合我们的品牌定位？", ["价格最低的产品", "以合理价格提供高品质配方", "医疗处方护肤品", "仅限彩妆"]],
    ["本地市场的核心顾客是谁？", ["仅限青少年", "热带气候中重视皮肤护理的现代顾客", "仅限60岁以上男士", "工业采购者"]],
    ["什么是我们一切工作的基础？", ["大幅打折", "信任、品质与效果", "一次性销售", "大量垃圾信息"]],
  ],
  2: [
    ["新经销商开始销售前必须……", ["立即开始，无需准备", "完成线上培训与现场入门培训", "只需缴费", "只需阅读一份PDF"]],
    ["每个模块测验的及格分数是……", ["50", "70", "90", "100"]],
    ["哪项违反我们的行为准则？", ["诚实介绍产品功效", "作出虚假的医疗承诺", "建议局部测试", "遵循标准作业流程"]],
    ["向顾客收取的价格应……", ["随意定价，压价竞争", "依据官方价格表", "始终免费", "对顾客保密"]],
    ["品牌机密资料应……", ["公开分享", "仅在经销商网络内使用", "出售给竞争对手", "匿名发布"]],
  ],
  3: [
    ["哪款产品是亮白氧气精华？", ["玻尿酸保湿乳霜", "美白精华", "温和洁面乳", "深层保湿面膜"]],
    ["正确的护肤顺序是什么？", ["面霜 → 精华 → 洁面", "洁面 → 爽肤水 → 精华 → 面霜", "精华 → 洁面 → 爽肤水", "面膜 → 洁面 → 爽肤水"]],
    ["修复屏障乳霜主要用什么来修护屏障？", ["酒精", "麦角硫因与胜肽", "香料", "黏土"]],
    ["肤色保湿防晒SPF35的特点是什么？", ["留下厚重泛白痕迹", "轻盈、保湿且不油腻", "完全代替保湿产品", "仅供夜间使用"]],
    ["哪项是早间护理的最后一步？", ["肤色保湿防晒SPF35", "深层保湿面膜", "温和洁面乳", "不需要任何产品"]],
  ],
  4: [
    ["收到订单后，首先应……", ["放置一星期不处理", "确认资料与库存，及时处理", "取消订单", "更改价格"]],
    ["顾客反馈刺激反应时，你应……", ["让顾客继续使用", "建议停用、安抚顾客，并按流程上报", "不理会顾客", "责怪顾客"]],
    ["我们的客服语气应……", ["粗鲁又急躁", "温暖、专业且乐于帮助", "机械生硬", "敷衍冷漠"]],
    ["退货应如何处理？", ["永不接受退货", "依据官方退换货政策", "只为朋友办理", "扣留款项"]],
    ["完整的订单记录有助于……", ["没有帮助", "跟进、补货与顾客服务", "掩盖错误", "回避顾客"]],
  ],
  5: [
    ["好的开场白应关注……", ["推销最贵产品", "顾客的皮肤困扰与目标", "谈论自己", "只谈折扣"]],
    ["面对“太贵了”，最佳回应是……", ["与顾客争辩", "说明价值、效果与每次使用成本", "放弃", "忽略意见"]],
    ["护肤品最可信的证明是……", ["夸大的功效", "真实的使用前后效果与顾客评价", "施压技巧", "虚假评价"]],
    ["促成销售时应……", ["强势施压", "建议明确的下一步与护理程序", "从不询问购买意向", "让顾客困惑"]],
    ["售后最佳做法是……", ["消失不见", "跟进使用效果与补购需求", "发送大量无关优惠", "什么都不做"]],
  ],
  6: [
    ["我们的社媒品牌语调应……", ["吵闹且充斥垃圾信息", "优雅、温暖且可信", "咄咄逼人", "前后不一致"]],
    ["哪项宣传不可使用？", ["“补水保湿”", "“永久治愈湿疹”", "“帮助提亮肤色”", "“轻盈肤感”"]],
    ["品牌配色与标志应……", ["随意修改", "按品牌指南一致使用", "忽略不管", "换成竞争对手的标志"]],
    ["促销必须遵循……", ["没有规则", "官方促销政策与价格", "随意折扣", "照搬竞争对手"]],
    ["顾客提供的评价应……", ["捏造", "真实且获得许可", "购买评价", "复制他人内容"]],
  ],
};

const ms: Record<number, Translation[]> = {
  1: [
    ["Apakah maksud “Merveilleux”?", ["Misteri", "Menakjubkan", "Moden", "Mineral"]],
    ["Formula kita dibangunkan mengikut standard apa?", ["Tiada standard tertentu", "Standard kosmetik Perancis", "Buatan rumah", "Gred makanan sahaja"]],
    ["Yang manakah paling tepat menggambarkan kedudukan jenama kita?", ["Produk paling murah", "Formula berkualiti mewah pada harga berpatutan", "Penjagaan kulit preskripsi perubatan", "Kosmetik warna sahaja"]],
    ["Siapakah pelanggan utama dalam pasaran ini?", ["Remaja sahaja", "Pelanggan moden yang menjaga kulit dalam iklim tropika", "Lelaki berusia lebih 60 tahun sahaja", "Pembeli industri"]],
    ["Apakah asas bagi semua tindakan kita?", ["Diskaun agresif", "Kepercayaan, kualiti dan hasil", "Jualan sekali sahaja", "Spam besar-besaran"]],
  ],
  2: [
    ["Sebelum menjual, pengedar baharu mesti…", ["Terus bermula tanpa persediaan", "Lengkapkan latihan dalam talian dan orientasi bersemuka", "Bayar yuran sahaja", "Baca satu PDF sahaja"]],
    ["Markah lulus bagi setiap kuiz modul ialah…", ["50", "70", "90", "100"]],
    ["Yang manakah melanggar tatakelakuan kita?", ["Dakwaan produk yang jujur", "Membuat janji perubatan palsu", "Nasihat ujian tampalan", "Mengikuti SOP"]],
    ["Harga untuk pelanggan sepatutnya…", ["Sesuka hati dengan memotong harga pesaing", "Mengikut senarai harga rasmi", "Sentiasa percuma", "Dirahsiakan daripada pelanggan"]],
    ["Bahan sulit jenama sepatutnya…", ["Dikongsi secara terbuka", "Disimpan dalam rangkaian pengedar", "Dijual kepada pesaing", "Disiarkan tanpa nama"]],
  ],
  3: [
    ["Produk manakah merupakan pekatan oksigen pencerahan?", ["Hyaluronate Moisturiser", "Oxy-Bright Serum", "Gentle Cleansing Milk", "Aqua-Concentrate Mask"]],
    ["Apakah urutan rutin yang betul?", ["Krim → Serum → Pencuci", "Cuci → Toner → Serum → Krim", "Serum → Cuci → Toner", "Topeng → Cuci → Toner"]],
    ["Cell Repair Treatment Cream membina semula lapisan pelindung terutamanya dengan…", ["Alkohol", "Ergothioneine dan peptida", "Pewangi", "Tanah liat"]],
    ["Refined HA UV Shield SPF35 menonjol kerana ia…", ["Meninggalkan kesan putih tebal", "Ringan, menghidrat dan tidak berminyak", "Menggantikan pelembap sepenuhnya", "Untuk kegunaan malam sahaja"]],
    ["Apakah langkah akhir rutin pagi?", ["Refined HA UV Shield SPF35", "Aqua-Concentrate Mask", "Gentle Cleansing Milk", "Tiada apa-apa"]],
  ],
  4: [
    ["Apabila pesanan diterima, tindakan pertama ialah…", ["Abaikan selama seminggu", "Sahkan butiran dan stok, kemudian proses segera", "Batalkan pesanan", "Tukar harga"]],
    ["Pelanggan melaporkan kerengsaan. Anda…", ["Suruh terus menggunakan produk", "Nasihatkan berhenti, tenangkan pelanggan dan eskalasi mengikut SOP", "Abaikan pelanggan", "Salahkan pelanggan"]],
    ["Nada khidmat pelanggan kita sepatutnya…", ["Kasar dan tergesa-gesa", "Mesra, profesional dan membantu", "Seperti robot", "Tidak mengambil peduli"]],
    ["Pemulangan perlu diuruskan…", ["Tidak pernah menerima pemulangan", "Mengikut polisi pemulangan dan pertukaran rasmi", "Untuk kawan sahaja", "Dengan menyimpan wang pelanggan"]],
    ["Rekod pesanan yang baik membantu…", ["Tiada apa-apa", "Susulan, tambah stok dan penjagaan pelanggan", "Menyembunyikan kesilapan", "Mengelak pelanggan"]],
  ],
  5: [
    ["Pembukaan perbualan yang baik memberi tumpuan pada…", ["Memaksa produk paling mahal", "Masalah kulit dan matlamat pelanggan", "Bercakap tentang diri sendiri", "Diskaun sahaja"]],
    ["Jawapan terbaik untuk “Terlalu mahal” ialah…", ["Bertengkar dengan pelanggan", "Terangkan nilai, hasil dan kos setiap penggunaan", "Berputus asa", "Abaikan bantahan"]],
    ["Bukti paling dipercayai dalam penjagaan kulit ialah…", ["Dakwaan berlebihan", "Hasil sebelum/selepas dan testimoni sebenar", "Taktik tekanan", "Ulasan palsu"]],
    ["Semasa menutup jualan, anda patut…", ["Mendesak dan agresif", "Cadangkan langkah seterusnya dan rutin yang jelas", "Tidak pernah meminta jualan", "Mengelirukan pelanggan"]],
    ["Selepas jualan, tindakan terbaik ialah…", ["Menghilang", "Buat susulan hasil dan pesanan semula", "Spam tawaran tidak berkaitan", "Tidak berbuat apa-apa"]],
  ],
  6: [
    ["Suara jenama kita di media sosial ialah…", ["Bising dan penuh spam", "Elegan, mesra dan dipercayai", "Agresif", "Tidak konsisten"]],
    ["Dakwaan manakah TIDAK dibenarkan?", ["“Menghidrat kulit”", "“Menyembuhkan ekzema secara kekal”", "“Membantu mencerahkan tona”", "“Hasil akhir ringan”"]],
    ["Warna dan logo jenama sepatutnya…", ["Ditukar sesuka hati", "Digunakan secara konsisten mengikut garis panduan", "Diabaikan", "Diganti dengan milik pesaing"]],
    ["Promosi mesti mengikuti…", ["Tiada peraturan", "Polisi promosi dan harga rasmi", "Diskaun rawak", "Apa sahaja yang pesaing lakukan"]],
    ["Testimoni pelanggan sepatutnya…", ["Dipalsukan", "Tulen dan dengan kebenaran", "Dibeli", "Disalin daripada orang lain"]],
  ],
};

function pack(translations: Record<number, Translation[]>): Record<number, QuizT[]> {
  return Object.fromEntries(seedModules.map((module) => [module.ord, module.quiz.map((q, i) => ({
    sourceQuestion: q.question,
    sourceOptions: q.options,
    question: translations[module.ord][i][0],
    options: translations[module.ord][i][1],
  }))]));
}

export const quizPacks = { zh: pack(zh), ms: pack(ms) };

/** Match stable module order + source identity; keep DB ids and scoring intact.
 * A customized or reordered question is never given an unrelated translation. */
export function localizeQuiz<T extends { question: string; options: string[] }>(
  ord: number, questions: T[], locale: Locale,
): T[] {
  const entries = locale === "en" ? [] : quizPacks[locale][ord] ?? [];
  return questions.map((q) => {
    const t = entries.find((entry) => entry.sourceQuestion === q.question
      && JSON.stringify(entry.sourceOptions) === JSON.stringify(q.options));
    return t ? { ...q, question: t.question, options: t.options } : q;
  });
}
