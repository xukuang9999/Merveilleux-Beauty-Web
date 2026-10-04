import type { Locale } from "./config";

const en = {
  uploaded: "Image uploaded.", uploadTooLarge: "Choose an image no larger than 5 MB.", uploadUnsupported: "Choose a JPEG, PNG, WebP or AVIF image.", uploadUnauthorized: "Sign in as an administrator to upload images.", draftGreeting: "Hi Merveilleux Beauty!",
  saving: "Saving…", saveFailed: "Could not save. Please try again.",
  quizFailed: "Your answers could not be submitted. They are still selected; please try again.",
  prepareEnquiry: "Prepare WhatsApp enquiry", enquiryReady: "Your enquiry is ready",
  enquirySaved: "Your details have been saved. Open WhatsApp and send the prepared message to complete your enquiry.",
  enquiryFailed: "We could not save your enquiry. Please retry, or send the prepared message directly via WhatsApp.",
  openWhatsApp: "Open WhatsApp and send", send: "Send", closeChat: "Close chat", openChat: "Chat with Margaux",
  chatFailed: "Unable to reply right now. Please try again.", connectionFailed: "Connection error. Please try again.",
  toggleMenu: "Toggle menu", language: "Language", uploading: "Uploading…", upload: "Upload", replace: "Replace", remove: "Remove",
  uploadFailed: "Upload failed. Please check your connection and try again.", noImage: "No image", imageHint: "JPEG, PNG, WebP or AVIF · max 5 MB",
  name: "Name", slug: "Slug", type: "Type", category: "Category", uncategorised: "Uncategorised",
  westPrice: "Price — West Malaysia", eastPrice: "Price — East Malaysia", unconfirmedPrice: "Leave blank until confirmed",
  eastPriceHint: "Sabah / Sarawak / Labuan. Leave blank to show a single price without region labels.",
  tagline: "Tagline", productImage: "Product image", sortOrder: "Sort order", published: "Published", description: "Description",
  ingredients: "Key ingredients (one per line)", benefits: "Benefits (one per line)", role: "Role",
  notFound: "Page not found", notFoundBody: "This page is unavailable. Return home to continue exploring.", home: "Return home",
};
type Copy = { [K in keyof typeof en]: string };
const zh: Copy = {
  uploaded: "图片已上传。", uploadTooLarge: "请选择不超过 5 MB 的图片。", uploadUnsupported: "请选择 JPEG、PNG、WebP 或 AVIF 图片。", uploadUnauthorized: "请以管理员身份登录后上传图片。", draftGreeting: "你好，Merveilleux Beauty！",
  saving: "正在保存…", saveFailed: "保存失败，请重试。", quizFailed: "答案提交失败。已保留你的选择，请重试。",
  prepareEnquiry: "准备 WhatsApp 咨询", enquiryReady: "咨询内容已准备好",
  enquirySaved: "你的资料已保存。请打开 WhatsApp 并发送准备好的消息，完成咨询。",
  enquiryFailed: "咨询保存失败。请重试，或直接通过 WhatsApp 发送准备好的消息。",
  openWhatsApp: "打开 WhatsApp 并发送", send: "发送", closeChat: "关闭聊天", openChat: "与 Margaux 聊天",
  chatFailed: "暂时无法回复，请重试。", connectionFailed: "连接失败，请重试。", toggleMenu: "展开或收起菜单", language: "语言",
  uploading: "正在上传…", upload: "上传", replace: "替换", remove: "移除", uploadFailed: "上传失败，请检查网络后重试。",
  noImage: "暂无图片", imageHint: "JPEG、PNG、WebP 或 AVIF · 最大 5 MB", name: "名称", slug: "网址标识", type: "类型", category: "分类", uncategorised: "未分类",
  westPrice: "售价 — 西马", eastPrice: "售价 — 东马", unconfirmedPrice: "未确认时留空", eastPriceHint: "沙巴、砂拉越及纳闽。留空时仅显示一个售价，不标注地区。",
  tagline: "产品短语", productImage: "产品图片", sortOrder: "排序", published: "已发布", description: "介绍", ingredients: "主要成分（每行一项）", benefits: "功效（每行一项）", role: "角色",
  notFound: "找不到页面", notFoundBody: "此页面暂不可用，请返回首页继续浏览。", home: "返回首页",
};
const ms: Copy = {
  uploaded: "Imej telah dimuat naik.", uploadTooLarge: "Pilih imej tidak melebihi 5 MB.", uploadUnsupported: "Pilih imej JPEG, PNG, WebP atau AVIF.", uploadUnauthorized: "Log masuk sebagai pentadbir untuk memuat naik imej.", draftGreeting: "Hai Merveilleux Beauty!",
  saving: "Sedang menyimpan…", saveFailed: "Gagal menyimpan. Sila cuba lagi.", quizFailed: "Jawapan tidak dapat dihantar. Pilihan anda dikekalkan; sila cuba lagi.",
  prepareEnquiry: "Sediakan pertanyaan WhatsApp", enquiryReady: "Pertanyaan anda sudah sedia",
  enquirySaved: "Butiran anda telah disimpan. Buka WhatsApp dan hantar mesej yang disediakan untuk melengkapkan pertanyaan anda.",
  enquiryFailed: "Kami tidak dapat menyimpan pertanyaan anda. Cuba lagi, atau hantar mesej yang disediakan terus melalui WhatsApp.",
  openWhatsApp: "Buka WhatsApp dan hantar", send: "Hantar", closeChat: "Tutup perbualan", openChat: "Berbual dengan Margaux",
  chatFailed: "Tidak dapat membalas sekarang. Sila cuba lagi.", connectionFailed: "Ralat sambungan. Sila cuba lagi.", toggleMenu: "Buka atau tutup menu", language: "Bahasa",
  uploading: "Sedang memuat naik…", upload: "Muat naik", replace: "Ganti", remove: "Buang", uploadFailed: "Muat naik gagal. Semak sambungan dan cuba lagi.",
  noImage: "Tiada imej", imageHint: "JPEG, PNG, WebP atau AVIF · maksimum 5 MB", name: "Nama", slug: "Pengenal URL", type: "Jenis", category: "Kategori", uncategorised: "Tanpa kategori",
  westPrice: "Harga — Malaysia Barat", eastPrice: "Harga — Malaysia Timur", unconfirmedPrice: "Biarkan kosong sehingga disahkan", eastPriceHint: "Sabah / Sarawak / Labuan. Biarkan kosong untuk memaparkan satu harga tanpa label wilayah.",
  tagline: "Slogan", productImage: "Imej produk", sortOrder: "Susunan", published: "Diterbitkan", description: "Penerangan", ingredients: "Ramuan utama (satu setiap baris)", benefits: "Manfaat (satu setiap baris)", role: "Peranan",
  notFound: "Halaman tidak ditemui", notFoundBody: "Halaman ini tidak tersedia. Kembali ke halaman utama untuk terus meneroka.", home: "Kembali ke halaman utama",
};
export function uiCopy(locale: Locale | string = "en"): Copy {
  return locale === "zh" ? zh : locale === "ms" ? ms : en;
}

export function uploadErrorCopy(status: number, locale: string): string {
  const copy = uiCopy(locale);
  return status === 413 ? copy.uploadTooLarge : status === 415 ? copy.uploadUnsupported : status === 401 || status === 403 ? copy.uploadUnauthorized : copy.uploadFailed;
}
