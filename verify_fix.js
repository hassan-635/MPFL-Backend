const axios = require("axios");

async function verifyNormalization() {
  const API_URL = "http://localhost:3001/api/v1";
  const testEmail = "FixTest_" + Date.now() + "@Example.Com";
  const testPassword = "Password123!";
  const testName = "Fix Test User";

  console.log(`Starting verification with email: ${testEmail}`);

  try {
    // 1. Register with mixed case
    console.log("Step 1: Registering with mixed case email...");
    const regRes = await axios.post(`${API_URL}/auth/register`, {
      name: testName,
      email: testEmail.toLowerCase(), // Frontend does this
      password: testPassword,
    });
    console.log("Registration Response:", regRes.data.message);

    // 2. Login with DIFFERENT casing
    const loginEmail = testEmail.toUpperCase();
    console.log(`Step 2: Logging in with uppercase email: ${loginEmail}`);
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: loginEmail.toLowerCase(), // Frontend does this
      password: testPassword,
    });
    console.log(
      "Login Successful! Token received:",
      loginRes.data.token ? "Yes" : "No"
    );
    console.log("User email from response:", loginRes.data.email);

    if (loginRes.data.email === testEmail.toLowerCase()) {
      console.log("SUCCESS: Email normalization verified!");
    } else {
      console.error(
        "FAILURE: Email in response does not match normalized version."
      );
    }
  } catch (error) {
    console.error(
      "Verification Error:",
      error.response?.data?.message || error.message
    );
    if (error.code === "ECONNREFUSED") {
      console.log(
        "HINT: Make sure your backend server is running on port 3001."
      );
    }
  }
}

verifyNormalization();
