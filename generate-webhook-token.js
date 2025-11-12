// Script untuk generate webhook verification token
const crypto = require('crypto');

function generateWebhookToken() {
  // Generate random 32-byte token dan convert ke hex
  const token = crypto.randomBytes(32).toString('hex');
  return token;
}

console.log('🔐 Generated Xendit Webhook Verification Token:');
console.log('');
console.log('XENDIT_WEBHOOK_TOKEN=' + generateWebhookToken());
console.log('');
console.log('📝 Copy token di atas ke file .env.local Anda');
console.log('🔗 Gunakan token yang sama di Xendit Dashboard untuk webhook verification');