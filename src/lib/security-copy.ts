import type { Locale } from "@/i18n/config";

const en = {
  nameInvalid: "Please enter a name between 2 and 200 characters.",
  emailInvalid: "Please enter a valid email address.",
  passwordInvalid: "Use a password between 8 and 128 characters.",
  credentialsInvalid: "Invalid email or password.",
  accountExists: "An account with this email already exists.",
  accountsUnavailable: "Accounts are temporarily unavailable. Please try again later.",
  createFailed: "Could not create your account. Please try again.",
  authLimited: "Too many attempts. Please try again after the cooldown.",
  badRequest: "Please send a valid chat message.",
  tooLarge: "Your message is too long. Please shorten it and try again.",
  unauthorized: "Please sign in to use this assistant.",
  forbidden: "This assistant is available to approved distributors only.",
  chatUnavailable: "The AI advisor is temporarily unavailable. Please contact us for help.",
  limited: "Too many messages. Please wait before trying again.",
  responseFailed: "I had trouble responding. Please try again or contact us for help.",
};
type SecurityCopy = typeof en;
const zh: SecurityCopy = {
  nameInvalid: "请输入 2 至 200 个字符的姓名。",
  emailInvalid: "请输入有效的电子邮箱。",
  passwordInvalid: "密码长度须为 8 至 128 个字符。",
  credentialsInvalid: "邮箱或密码不正确。",
  accountExists: "该邮箱已注册账号。",
  accountsUnavailable: "账号服务暂时不可用，请稍后再试。",
  createFailed: "未能创建账号，请重试。",
  authLimited: "尝试次数过多，请在冷却时间结束后重试。",
  badRequest: "请提交有效的聊天消息。",
  tooLarge: "消息过长，请缩短后重试。",
  unauthorized: "请先登录后使用此助手。",
  forbidden: "此助手仅供获批经销商使用。",
  chatUnavailable: "AI 顾问暂时不可用，请联系我们获得帮助。",
  limited: "消息次数过多，请稍后重试。",
  responseFailed: "暂时无法回复，请重试或联系我们获得帮助。",
};
const ms: SecurityCopy = {
  nameInvalid: "Masukkan nama antara 2 hingga 200 aksara.",
  emailInvalid: "Masukkan alamat e-mel yang sah.",
  passwordInvalid: "Gunakan kata laluan antara 8 hingga 128 aksara.",
  credentialsInvalid: "E-mel atau kata laluan tidak sah.",
  accountExists: "Akaun dengan e-mel ini sudah wujud.",
  accountsUnavailable: "Perkhidmatan akaun tidak tersedia buat sementara waktu. Cuba lagi nanti.",
  createFailed: "Akaun anda tidak dapat dicipta. Sila cuba lagi.",
  authLimited: "Terlalu banyak percubaan. Cuba lagi selepas tempoh menunggu.",
  badRequest: "Hantar mesej sembang yang sah.",
  tooLarge: "Mesej anda terlalu panjang. Pendekkan dan cuba lagi.",
  unauthorized: "Log masuk untuk menggunakan pembantu ini.",
  forbidden: "Pembantu ini hanya tersedia untuk pengedar yang diluluskan.",
  chatUnavailable: "Penasihat AI tidak tersedia buat sementara waktu. Hubungi kami untuk bantuan.",
  limited: "Terlalu banyak mesej. Tunggu sebelum mencuba lagi.",
  responseFailed: "Saya tidak dapat membalas sekarang. Cuba lagi atau hubungi kami untuk bantuan.",
};
export function securityCopy(locale: Locale): SecurityCopy {
  return locale === "zh" ? zh : locale === "ms" ? ms : en;
}
