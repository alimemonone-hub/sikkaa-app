// Generates a short, human-friendly referral code like "SIKKA-7XQ2"
function generateReferralCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no confusing chars (0/O, 1/I)
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `SIKKA-${code}`;
}

module.exports = generateReferralCode;
