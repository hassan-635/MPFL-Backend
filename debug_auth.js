const bcrypt = require("bcryptjs");

async function test() {
  const password = "testpassword";
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  console.log("Password:", password);
  console.log("Hashed Password:", hashedPassword);

  const match = await bcrypt.compare(password, hashedPassword);
  console.log("Match:", match);

  const wrongMatch = await bcrypt.compare("wrongpassword", hashedPassword);
  console.log("Wrong Match (should be false):", wrongMatch);
}

test().catch(console.error);
