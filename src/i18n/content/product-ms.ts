import { catalogueProducts } from "@/lib/catalogue-products";
import type { ProductT } from "./types";

type Copy = Pick<ProductT, "tagline" | "description" | "benefits"> & Pick<Partial<ProductT>, "contents" | "howToUse">;

// Translate the current catalogue. Ingredient names remain the canonical INCI
// / product component names; translating copy must never introduce a formula.
const copy: Record<string, Copy> = {
  "advance-white-professional-treatment": {
    tagline: "Cerah, licin, tegang dan berseri tanpa suntikan",
    description: "Rawatan pencerahan profesional untuk kulit kering, normal dan matang, tanpa suntikan. Kompleks enzim dan botani menanggalkan sel mati, menyokong pembaharuan kulit dan mengurangkan pembentukan melanin untuk kulit yang lebih cerah dan tegang. Tidak disyorkan untuk kulit berjerawat, meradang atau sensitif.",
    benefits: ["Pencerahan, penegangan dan seri dalam satu sesi", "Seri lembap tanpa suntikan", "Lembut untuk kulit kering, normal dan matang", "Hasil ketara yang menggalakkan rawatan berulang", "Mencerahkan tona 1–2 tahap dan menghaluskan liang"],
    howToUse: ["Cuci dua kali, gunakan AW Caviar Lime Enzyme, lakukan pengekstrakan, kemudian AW Active Complex.", "Masukkan AW Treatment Serum dengan peranti, kemudian Hydrating Ampoule.", "Urut wajah, kemudian gunakan AW Treatment Silk Masque selama 20–30 minit."],
  },
  "aqua-concentrate-mask": {
    tagline: "Hidrasi intensif yang mengunci kelembapan untuk kulit lembut dan berseri",
    description: "Kaya dengan esens tumbuhan dan molekul air hialuronik untuk hidrasi berpanjangan serta tona kulit yang lebih seimbang dan sekata.",
    benefits: ["Menambah kelembapan", "Mengunci hidrasi dan mencegah kehilangan air", "Melegakan rasa tegang akibat kekeringan", "Kulit lebih lembut, halus dan berseri", "Disyorkan sebagai kursus hidrasi intensif 7 hari"],
    howToUse: ["Gunakan selama 7 hari berturut-turut sebagai kursus hidrasi intensif."],
  },
  "brightening-plus-hydrating-trial-set": {
    tagline: "Set percubaan pencerahan dan hidrasi untuk kulit kusam dengan liang tersumbat",
    description: "Set percubaan pencerahan dan hidrasi untuk kulit kusam dengan liang tersumbat. Sila sahkan kandungan set semasa dengan penasihat sebelum membuat pesanan.",
    benefits: ["Saiz percubaan untuk mencerahkan kulit kusam dan menghidrat kulit dengan liang tersumbat", "Tanya penasihat tentang kandungan set semasa"], contents: [],
  },
  "cell-repair-treatment-cream": {
    tagline: "Pembaikan lapisan pelindung dan penguncian kelembapan dengan rasa ringan",
    description: "Ergothioneine dan bahan pelembap membantu membaiki lipid dan melindungi sel kulit. Peptida serta ekstrak tumbuhan menyuburkan kulit, melegakan kekeringan dan mengurangkan kekusaman untuk kulit anjal dan berseri.",
    benefits: ["Membina semula lapisan pelindung kulit", "Melegakan kekeringan sambil menambah dan mengunci kelembapan serta nutrien", "Membaiki lipid kulit secara intensif"],
  },
  "ceramide-ice-essence-toner": {
    tagline: "Toner seramide untuk membaiki dan menguatkan lapisan pelindung",
    description: "Toner kaya seramide yang menambah dan membaiki membran sebum, melindungi daripada alergen dan bakteria luaran, mengurangkan kehilangan kelembapan dan menguatkan lapisan pelindung kulit.",
    benefits: ["Sesuai untuk semua jenis kulit", "Menyokong metabolisme dan penghantaran nutrien", "Kulit lebih licin, halus dan anjal dengan kurang garisan", "Hasil ketara pada kulit sensitif"],
  },
  "congested-set": {
    tagline: "Set percubaan pemurnian untuk kulit dengan liang tersumbat",
    description: "Set percubaan untuk kulit dengan liang tersumbat. Sila sahkan kandungan set semasa dengan penasihat sebelum membuat pesanan.",
    benefits: ["Menyasarkan liang tersumbat", "Rutin percubaan untuk pemurnian dan keseimbangan", "Tanya penasihat tentang kandungan set semasa"], contents: [],
  },
  "daily-care-trial-set": {
    tagline: "Tiga produk saiz perjalanan untuk penjagaan asas harian",
    description: "Set permulaan penjagaan asas harian: pencuci lembut, pencuci mendalam dan toner pembaikan lapisan pelindung dalam saiz perjalanan. Mengandungi Gentle Cleansing Milk 30 ml, Ultrafine Cleansing Gel 20 ml dan Ceramide Ice-Essence Toner 30 ml.",
    benefits: ["Gentle Cleansing Milk 30 ml", "Ultrafine Cleansing Gel 20 ml", "Ceramide Ice-Essence Toner 30 ml", "Saiz mudah dibawa untuk mencuba rutin penjagaan asas harian"],
    contents: ["Gentle Cleansing Milk 30 ml", "Ultrafine Cleansing Gel 20 ml", "Ceramide Ice-Essence Toner 30 ml"],
  },
  "essential-lotion": {
    tagline: "Toner mawar yang menghidrat, menghaluskan dan menenangkan",
    description: "Ekstrak mawar semula jadi, aloe vera dan Vitamin B5 menghidrat serta membantu pembaikan kulit. Ia memberi kelembapan dan perlindungan antioksidan, menghaluskan rupa liang, melindungi daripada radikal bebas dan menenangkan sensitiviti.",
    benefits: ["Menghidrat dan membantu pembaikan", "Perlindungan antioksidan", "Menghaluskan liang", "Melindungi daripada radikal bebas", "Menenangkan sensitiviti"],
  },
  "eye-egf-serum": {
    tagline: "Menegangkan dan menyegarkan kawasan mata untuk rupa lebih cerah",
    description: "Serum mata yang digunakan selepas toner dan sebelum krim mata. Ia menyuburkan dan menghidrat kawasan mata, melicinkan tanda penuaan dan mencerahkan kekusaman untuk mata yang kelihatan lebih tegang dalam sekitar 10 hari.",
    benefits: ["Menyuburkan dan menghidrat kawasan mata", "Menegangkan dan melicinkan tanda penuaan", "Mencerahkan kulit gelap dan kusam", "Kawasan mata kelihatan lebih tegang dalam sekitar 10 hari"],
    howToUse: ["Gunakan selepas toner sebagai langkah kedua rutin, sebelum krim mata."],
  },
  "gentle-cleansing-milk": {
    tagline: "Susu pencuci molekul mikro untuk cucian mendalam yang lembut",
    description: "Susu pencuci molekul mikro yang mengemulsi minyak untuk membersih secara menyeluruh tetapi lembut. Ia menanggalkan kotoran pada kulit dan liang sambil melembap dan menenangkan, meninggalkan kulit bersih, lembut dan halus.",
    benefits: ["Cucian liang mendalam", "Mencegah liang tersumbat", "Meningkatkan penyerapan langkah seterusnya", "Mencegah kehilangan air", "Mengekalkan kelembapan dan kelembutan", "Sesuai untuk semua jenis kulit"],
  },
  "hyaluronate-moisturizer": {
    tagline: "Asid hialuronik pekat untuk hidrasi mendalam dan berpanjangan",
    description: "Asid hialuronik berkepekatan tinggi menghidrat secara intensif dan mengunci kelembapan, mencegah kehilangan air serta meningkatkan keanjalan dan kelembutan sambil mengurangkan tanda penuaan.",
    benefits: ["Meningkatkan hidrasi dan keanjalan", "Mengurangkan garis halus dan kedutan", "Sesuai untuk kulit kekurangan air dan sensitif", "Menyokong pembentukan kolagen dan pembaharuan"],
  },
  "hydro-moist-serum": {
    tagline: "Mengunci kelembapan dan membentuk lapisan pelindung untuk kulit anjal",
    description: "Mengandungi air Witch Hazel, Sodium Hyaluronate dan seramide untuk meningkatkan keupayaan kulit mengekalkan kelembapan, membentuk lapisan pelindung, membaiki lipid, menenangkan keradangan dan menyokong pertahanan semula jadi kulit.",
    benefits: ["Membentuk lapisan pelindung dan menenangkan keradangan", "Mencegah kehilangan air dan sensitiviti", "Menyokong pembaharuan sel untuk keseimbangan kelembapan", "Hidrasi mendalam dan seri", "Kulit lebih lembut, licin dan anjal dengan kurang garis halus"],
  },
  "hydro-sensi-concentrate": {
    tagline: "Penggalak hidrasi molekul mikro untuk kulit tenang dan licin",
    description: "Bahan aktif semula jadi seperti alga marin, asid hialuronik, camomil dan Witch Hazel menenangkan kekeringan, kegatalan serta ketidakselesaan. Ia memberi hidrasi mendalam, membantu pembaikan lapisan pelindung, pencerahan dan tekstur lebih licin.",
    benefits: ["Hidrasi mendalam", "Membaiki lapisan pelindung", "Melegakan kekeringan, kegatalan dan keradangan", "Mencerahkan dan melicinkan tekstur"],
    howToUse: ["Gunakan selepas mencuci sebagai langkah penjagaan pertama untuk membantu penyerapan produk seterusnya."],
  },
  "intense-lift-eye-treatment-creme": {
    tagline: "Menegangkan, mencerahkan dan mengurangkan rupa lingkaran gelap",
    description: "Dirumus dengan White Truffle dan ekstrak kopi untuk menyokong pembaharuan serta pertumbuhan sel. Peptida molekul mikro dan bahan aktif mengurangkan rupa kedutan dan kantung mata.",
    benefits: ["Mengurangkan garis halus dan sembap", "Menegangkan kawasan mata", "Meningkatkan peredaran mikro", "Mengurangkan lingkaran gelap"],
    howToUse: ["Sebagai langkah akhir penjagaan mata, tepuk sedikit krim dengan lembut di sekitar mata."],
  },
  "intensive-hydro-treatment-silk-mask": {
    tagline: "Hidrasi mendalam dan seri yang diperbaharui",
    description: "Topeng helaian sutera untuk hidrasi dan seri kulit, membantu kekeringan, kekasaran dan kulit yang kelihatan letih sambil mengunci kelembapan berpanjangan.",
    benefits: ["Hidrasi mendalam untuk sistem kelembapan kulit", "Penguncian kelembapan berpanjangan", "Mencerahkan kekusaman dan rupa letih", "Menyokong pembaharuan sel untuk mengurangkan penuaan", "Meningkatkan keanjalan dan kehalusan untuk kulit lembap dan anjal"],
  },
  "intensive-medic-cell-treatment": {
    tagline: "Membina semula keseimbangan dan membaiki dari punca",
    description: "Sistem rawatan sel profesional bertaraf perubatan untuk kulit bermasalah. Ia menstabilkan keradangan, memulihkan keseimbangan mikrobiom, menyokong pembaikan sel dan membina semula lapisan pelindung, dengan manfaat antipenuaan serta pengurangan pigmentasi. Penambahbaikan ketara dalam 1–3 sesi.",
    benefits: ["Membina semula keseimbangan mikrobiom", "Menyasarkan dan mengurangkan keradangan", "Menyokong pembaikan dan penjanaan semula sel", "Membina semula struktur lapisan pelindung", "Penjagaan antipenuaan dan pigmentasi untuk kulit lebih bersih dan tenang"],
    howToUse: ["Cuci dua kali, gunakan gel pengelupasan, kemudian lakukan pengekstrakan.", "Gunakan topeng gel menenangkan, kemudian serbuk asid amino bersama Nano Mist.", "Sapu serbuk pemulihan melawan arah liang, gunakan topeng Stem Cell selama 20 minit, kemudian pelindung matahari."],
  },
  "intensive-restoration-powder": {
    tagline: "Serbuk peptida pembaikan bertaraf perubatan untuk kulit lemah dan sensitif",
    description: "Serbuk peptida molekul kecil bertaraf perubatan dengan kuasa pembaikan untuk menjana semula sel rosak dan mengurangkan faktor sensitiviti serta kemerahan yang berkaitan dengan alahan dan kapilari pecah, sebagai asas pemulihan.",
    benefits: ["Menjana semula sel rosak", "Antioksidan semula jadi membantu mengawal fibroblas tisu parut", "Mengurangkan parut jerawat", "Menghidrat kulit kering dan kasar", "Menenangkan kemerahan dan sensitiviti"],
  },
  "intensive-restoration-serum": {
    tagline: "Menenangkan sensitiviti serta menyokong pertahanan dan pembaikan kulit",
    description: "Bahan aktif pembaikan pekat untuk kulit sensitif dan lapisan kutikel terlalu nipis. Tindakan antioksidan dan antialahan mengurangkan kemerahan serta sensitiviti, menenangkan, menyusun semula dan membaiki sel rosak serta menguatkan pertahanan kulit.",
    benefits: ["Mengurangkan kemerahan dan sensitiviti dengan segera", "Menenangkan kulit", "Menyusun semula dan membaiki kulit rosak", "Mengurangkan kerengsaan dan keradangan", "Menguatkan pertahanan kulit"],
  },
  "intensive-restoration-treatment-silk-mask": {
    tagline: "Pembaikan lapisan pelindung untuk kulit tenang dan seimbang",
    description: "Topeng helaian sutera untuk kulit sensitif dan rosak. Mekanisme pembaikan lapisan pelindung dan penenangan keradangan membentuk filem pelindung serta memberi pertahanan antioksidan untuk memulihkan keseimbangan.",
    benefits: ["Pertahanan antioksidan", "Menenangkan kemerahan, keradangan dan ketidakselesaan", "Membentuk lapisan pelindung dan menguatkan pertahanan", "Pembaikan sel mendalam dan sokongan pembaikan semula jadi", "Memulihkan keseimbangan untuk kulit stabil dan selesa"],
  },
  "medic-ice-hydro-soothing-mask": {
    tagline: "Ketenangan sejuk untuk kulit merah dan terdedah kepada matahari",
    description: "Topeng helaian penyejuk dengan esens pembaikan pekat: Allantoin, Provitamin B5 dan asid hialuronik. Rawatan sejuk 20 minit mengurangkan kemerahan dengan pantas, menenangkan, menghidrat dan melegakan kulit selepas terdedah kepada matahari.",
    benefits: ["Menenangkan kemerahan dengan pantas", "Hidrasi mendalam yang menenangkan", "Penyejukan segera selepas matahari", "Antiradang melalui Allantoin dan Scutellaria", "Pertahanan antioksidan melalui akar likuoris dan daun rosemary"],
    howToUse: ["Gunakan pada kulit bersih selama 20 minit untuk rawatan penyejuk, kemudian tepuk baki esens sehingga menyerap."],
  },
  "medic-restore-gel": {
    tagline: "Menenangkan keradangan serta membaiki dan menstabilkan kulit reaktif",
    description: "Formula pemulihan bertaraf perubatan untuk melegakan keradangan dan kegatalan, memberi manfaat antibakteria dan antioksidan, mengurangkan reaksi alahan serta membaiki lapisan pelindung lemah. Mengandungi ekstrak botani Matrine, Taraxacum, Prunella Vulgaris dan Stemona serta Niacinamide.",
    benefits: ["Menenangkan keradangan, kemerahan dan ketidakselesaan", "Antibakteria dan melegakan kegatalan", "Antioksidan dan antialahan", "Menguatkan pertahanan dan menyokong penjanaan semula", "Sesuai untuk kulit selepas prosedur, sensitif atau berjerawat"],
    howToUse: ["Sapu pada kawasan meradang, jerawat, liang tersumbat, pustul dan kemerahan.", "Pada waktu siang, sapu setempat 5–6 kali.", "Pada waktu malam, sapu lapisan tebal pada kawasan meradang sebelum tidur."],
  },
  "micellaire-solution": {
    tagline: "Air micellar bebas minyak untuk menanggalkan solekan dengan lembut",
    description: "Air micellar menyegarkan dan bebas minyak dengan ekstrak bunga mawar untuk mengangkat solekan serta kotoran sambil memberi penjagaan lembut, kelembapan dan nutrien semula jadi.",
    benefits: ["Menanggalkan solekan dengan cepat dan menyeluruh", "Penjagaan lembut dengan nutrien semula jadi", "Hidrasi mendalam dengan faktor penguncian kelembapan"],
  },
  "micro-nano-mist": {
    tagline: "Teknologi air nano untuk hidrasi mendalam",
    description: "Pekatan penghidratan dengan teknologi air mikro-nano untuk menghantar molekul air bersaiz nano (kelompok 3–5 molekul) ke dalam sel kulit, membaiki kutikel, menyeimbangkan mikrobiom dan menstabilkan lapisan pelindung.",
    benefits: ["Membaiki dan menguatkan lapisan pelindung", "Menghaluskan liang dan tekstur", "Menyegarkan kulit kusam dan meningkatkan penyerapan", "Menenangkan sensitiviti", "Melegakan kekeringan, ketegangan dan pengelupasan", "Menyeimbangkan minyak, air dan pH"],
  },
  "o2-clear-bubble-mask": {
    tagline: "Topeng berbuih sendiri untuk cucian mendalam dan kulit tenang",
    description: "Bahan aktif semula jadi memurnikan liang, menyerap minyak berlebihan serta memberi penjagaan antibakteria dan antiradang. Topeng berbuih sendiri ini melarutkan timbunan dalam liang dengan lembut, menenangkan kemerahan, membantu lapisan pelindung sensitif dan mencerahkan kulit kusam.",
    benefits: ["Buih membersihkan sisa dalam liang", "Menenangkan kulit meradang", "Mencerahkan kekusaman dan kekasaran", "Menguatkan lapisan pelindung terhadap sensitiviti", "Menyediakan kulit untuk penyerapan langkah seterusnya"],
    howToUse: ["Selepas cucian mendalam, gunakan topeng menenangkan atau menghidrat."],
  },
  "oxy-bright-serum": {
    tagline: "Pengoksigenan intensif untuk tona cerah berpanjangan",
    description: "Memberi kesan pencerahan berpanjangan, menyokong metabolisme kulit melalui pengoksigenan intensif dan menyegarkan kulit dengan bahan aktif seperti ekstrak Camu Camu.",
    benefits: ["Memperbaiki tekstur", "Mengurangkan kekusaman dan kekasaran", "Meratakan tona", "Menguatkan pertahanan sel", "Antipenuaan dan antioksidan"],
  },
  "pimples-trial-set": {
    tagline: "Set percubaan untuk kulit mudah berjerawat",
    description: "Set percubaan untuk kulit mudah berjerawat. Mengandungi Intensive Restoration Sérum 10 ml, Blemish Serum 5 ml dan Hydro-Sensi Concentré 10 ml.",
    benefits: ["Intensive Restoration Sérum 10 ml", "Blemish Serum 5 ml", "Hydro-Sensi Concentré 10 ml", "Saiz percubaan untuk kulit mudah berjerawat"],
    contents: ["Intensive Restoration Sérum 10 ml", "Blemish Serum 5 ml", "Hydro-Sensi Concentré 10 ml"],
  },
  "plantcell-salon-treatment": {
    tagline: "Rawatan salon dua ampul untuk kulit lebih cerah dan lembap",
    description: "Rawatan wajah salon profesional dengan ampul pencerahan dan ampul hidrasi, dipadankan dengan topeng Medic Ice untuk meratakan pigmentasi, melicinkan tekstur dan meningkatkan seri.",
    benefits: ["Mencerahkan dan meratakan pigmentasi", "Melicinkan dan menghaluskan tekstur", "Hidrasi mendalam", "Meningkatkan seri", "Protokol dua ampul profesional"],
  },
  "pore-refine-serum": {
    tagline: "Membersihkan liang tersumbat dan menenangkan jerawat degil",
    description: "Untuk kulit mudah berjerawat dan berminyak, dengan bahan aktif astringen untuk mengurangkan liang tersumbat, menanggalkan bintik hitam dan putih, menenangkan keradangan serta menyokong pembaharuan dan pembaikan kulit.",
    benefits: ["Membersihkan liang tersumbat, bintik hitam dan putih", "Antiradang dan mengawal bakteria jerawat", "Menyokong metabolisme dan menghaluskan tekstur liang", "Menyeimbangkan sebum", "Membaiki tisu rosak"],
  },
  "refined-ha-uv-shield-spf35": {
    tagline: "SPF35 spektrum luas dengan hidrasi sepanjang hari",
    description: "Pelindung matahari harian spektrum luas, kaya air Witch Hazel dan asid hialuronik. Melindungi daripada UVA dan UVB dengan rasa ringan dan tidak berminyak.",
    benefits: ["Perlindungan UVA/UVB spektrum luas", "Mencegah kehilangan air dengan kelembapan sehingga 12 jam", "Mencegah pigmentasi dan kedutan", "Hasil akhir licin dan muda"],
    howToUse: ["Selepas toner dan pelembap, sapu sekata pada muka dan leher hingga menyerap.", "Gunakan setiap pagi, 20 minit sebelum aktiviti luar.", "Sapu semula setiap 2–3 jam."],
  },
  "refined-hydro-care": {
    tagline: "Krim tumbuhan dan peptida lembut untuk menenangkan dan membaiki",
    description: "Ekstrak tumbuhan semula jadi, peptida oat dan asid hialuronik menyokong pembaikan sel kulit. Lembut dan sesuai untuk semua jenis kulit, ia menenangkan serta membantu membina semula kulit rosak sambil mengekalkan kelembapan.",
    benefits: ["Membina semula dan membaiki sel kulit", "Mengurangkan sensitiviti", "Melegakan kekeringan, kegatalan dan keradangan"],
  },
  "repair-treatment-oil": {
    tagline: "Minyak lipid laut dalam untuk pembaikan, nutrisi dan penegangan",
    description: "Minyak lipid telur ikan laut dalam untuk menyokong pembaikan kulit, menenangkan alahan dan keradangan, melembap serta menegangkan. Teksturnya kaya dan mudah menyerap, membentuk filem pelembap bernafas serta menambah kolesterol kulit untuk melicinkan kedutan dan menegangkan kulit matang.",
    benefits: ["Mempercepat pembaikan kulit rosak", "Antialahan dan antiradang", "Melembap dan melembutkan secara mendalam", "Meningkatkan keanjalan dan ketegangan", "Antipenuaan dan pelicinan kedutan"],
  },
  "repairing-plus-hydrating-trial-set": {
    tagline: "Tiga produk percubaan pembaikan dan hidrasi untuk kulit sensitif dan kekurangan air",
    description: "Set percubaan pembaikan dan hidrasi untuk kulit sensitif dan kekurangan air. Mengandungi Intensive Restoration Sérum 10 ml, Hydro-Sensi Concentré 10 ml dan Hydro-Moist Sérum 10 ml.",
    benefits: ["Intensive Restoration Sérum 10 ml", "Hydro-Sensi Concentré 10 ml", "Hydro-Moist Sérum 10 ml", "Saiz percubaan untuk pembaikan dan hidrasi mendalam kulit sensitif"],
    contents: ["Intensive Restoration Sérum 10 ml", "Hydro-Sensi Concentré 10 ml", "Hydro-Moist Sérum 10 ml"],
  },
  "revitalize-anti-oxidant-creme": {
    tagline: "Mengunci kelembapan untuk kulit anjal, tegang dan berseri",
    description: "Hexapeptide-8 menyokong pemulihan kolagen, pembaikan rangkaian elastin yang menua serta tahap kolagen dan elastin yang membantu menegangkan kulit kendur.",
    benefits: ["Pengekalan kelembapan tinggi", "Antipenuaan, keanjalan dan penegangan", "Ringan, tidak berminyak dan cepat menyerap", "Mencerahkan tona"],
  },
  "revitalize-anti-oxidant-essence": {
    tagline: "Menganjalkan, menghidrat dan memulihkan seri semula jadi",
    description: "Hexapeptide-8 membantu menambah kolagen dan membaiki rangkaian elastin yang menua untuk mencegah kekenduran serta elastosis, dan mengurangkan tanda penuaan untuk rupa segar dan berseri.",
    benefits: ["Menambah kolagen", "Mencegah kekenduran dan elastosis", "Menangani tanda penuaan", "Memulihkan seri"],
  },
  "revitalize-anti-oxidant-serum": {
    tagline: "Menyusun semula kolagen, menegangkan dan mengurangkan kekenduran",
    description: "Serum antioksidan pekat dengan Hexapeptide-8 yang menyerap ke epidermis, menyusun semula kolagen dan elastin, menyokong aktiviti elastin serta melembap secara mendalam untuk penegangan dan pembaharuan.",
    benefits: ["Menyokong dan menyusun semula kolagen", "Menegangkan dan melicinkan kedutan", "Hidrasi mendalam", "Memulihkan seri"],
  },
  "rose-rosemary-essence-oil": {
    tagline: "Minyak antiglikasi ringan untuk kulit licin dan anjal",
    description: "Campuran minyak tumbuhan yang mengunci nutrien, menyuburkan dan melembutkan kulit untuk seri. Antioksidan semula jadi membantu menghalang pembentukan AGEs (antiglikasi), mengurangkan kekuningan dan menghaluskan kulit kasar.",
    benefits: ["Mengunci nutrien dan kelembapan", "Antioksidan antiglikasi", "Mengurangkan kekuningan", "Melembutkan kulit kasar", "Menambah seri"],
    howToUse: ["Gunakan sebagai langkah akhir rutin untuk mengunci nutrien dan kelembapan."],
  },
  "soothing-gel-mask": {
    tagline: "Topeng gel penyejuk untuk kulit tenang, terhidrat dan stabil",
    description: "Formula ekstrak timun, alga dan aloe vera memberi hidrasi berlapis serta penenangan. Menyejukkan, menenangkan dan menghidrat dengan pantas, sesuai untuk kulit sensitif, meradang, mudah tersumbat dan tidak stabil.",
    benefits: ["Menyejukkan dan menenangkan dengan pantas", "Hidrasi berlapis", "Melegakan keradangan dan menghaluskan tekstur", "Meratakan dan mencerahkan tona", "Menyediakan penyerapan langkah seterusnya"],
  },
  "ultrafine-cleansing-gel": {
    tagline: "Buih selembut madu yang membersih tanpa mengeringkan",
    description: "Gel pencuci lembut bertekstur madu dengan buih padat dan halus untuk mengangkat kotoran dalam liang tanpa cucian berlebihan. Kulit terasa tenang, lembap dan tidak tegang atau kering.",
    benefits: ["Mengekalkan pH semula jadi dan mengurangkan sebum", "Mencegah kekeringan sambil melembap", "Melindungi dan membaiki lapisan pelindung", "Kulit anjal dan licin"],
  },
  "uv-protection-spf35": {
    tagline: "Perlindungan UV harian ringan dengan sentuhan kering",
    description: "Pelindung matahari amat ringan dan tidak berminyak dengan teknologi sentuhan kering. Melindungi daripada UVA, UVB dan tekanan oksidatif sambil menyokong pertumbuhan dan pembaharuan sel.",
    benefits: ["Pertahanan UVA/UVB spektrum luas", "Melindungi daripada tekanan oksidatif", "Menyokong pembaharuan sel", "Ringan, sentuhan kering dan tidak berminyak"],
  },
  "vital-perfect-uv-spf30": {
    tagline: "Perlindungan UV harian yang melembapkan",
    description: "Pelindung matahari harian yang melindungi daripada kerosakan UV sambil mengekalkan hidrasi dan keselesaan, dengan sapuan ringan dan licin seperti asas solekan.",
    benefits: ["Perlindungan UV spektrum luas", "Mengekalkan hidrasi dan keselesaan", "Memperindah tona secara semula jadi", "Ringan dan tidak berminyak"],
  },
  "whitening-stem-cell": {
    tagline: "Serum malam untuk pencerahan dan pengurangan bintik gelap",
    description: "Serum malam yang menyokong pengaktifan sel stem kulit dan penjanaan semula, penguraian melanin serta pencerahan untuk kulit halus, licin dan sekata dengan kurang bintik gelap. Untuk kegunaan malam sahaja.",
    benefits: ["Mengaktifkan sel stem kulit dan pembaharuan", "Menguraikan melanin", "Mencerahkan dan mengurangkan bintik gelap", "Menghaluskan dan melicinkan tekstur", "Untuk kegunaan malam"],
    howToUse: ["Gunakan pada waktu malam sebagai langkah kedua selepas toner atau esens hidrasi."],
  },
  "youth-ha-moisturizer": {
    tagline: "Pencerahan dan penguncian kelembapan dengan sentuhan kering",
    description: "Bahan aktif seperti likuoris (Glabridin) dan ekstrak tumbuhan membantu kekeringan akibat kekurangan air, kehilangan kolagen atau penuaan, mencerahkan serta mengunci kelembapan untuk seri berpanjangan.",
    benefits: ["Mencerahkan tona", "Memulihkan keseimbangan kelembapan", "Menyokong pembentukan kolagen dan keanjalan", "Mengurangkan pigmentasi", "Menyokong pembaharuan kulit"],
  },
  "blemish-serum": {
    tagline: "Penjagaan setempat untuk kulit mudah berjerawat",
    description: "Serum setempat untuk jerawat aktif dan kawasan tersumbat, direka untuk menenangkan rupa kemerahan dan menyokong kulit yang kelihatan lebih bersih.",
    benefits: ["Menyasarkan jerawat aktif", "Membantu menenangkan kemerahan yang ketara", "Menyokong kulit yang kelihatan lebih bersih"],
    howToUse: ["Selepas mencuci, sapu sedikit terus pada jerawat.", "Susuli dengan pelembap dan perlindungan matahari pada waktu siang."],
  },
  "advanced-bio-peptide-treatment": {
    tagline: "Penjagaan peptida profesional untuk kulit lebih licin dan tegang",
    description: "Rawatan profesional untuk hidrasi, keanjalan dan pengurangan rupa garis halus. Sila berbincang dengan penasihat tentang komponen rawatan serta protokol salon.",
    benefits: ["Menyokong rupa kulit lebih tegang", "Mengurangkan rupa garis halus", "Membantu menambah hidrasi"],
  },
};

export const msProducts: Record<string, ProductT> = Object.fromEntries(catalogueProducts.map((p) => {
  const translated = copy[p.slug];
  if (!translated) throw new Error(`Missing BM catalogue translation: ${p.slug}`);
  return [p.slug, {
    type: p.kind === "treatment" ? "Rawatan Profesional" : p.kind === "bundle" ? "Set Percubaan" : "Produk",
    keyIngredients: [...p.keyIngredients],
    ...translated,
  }];
}));
