// =====================================================================
// 1. LIBRARIES AND ENVIRONMENT VARIABLES
// =====================================================================

// Loads secret keys (tokens, DB passwords) from the .env file into process.env.
require('dotenv').config(); 

const express = require('express'); // HTTP framework for setting up the webhook server
const { createClient } = require('@supabase/supabase-js'); // Supabase (PostgreSQL) client
const nodemailer = require('nodemailer'); // Email (Gmail) SMTP engine
const axios = require('axios'); // HTTP POST requests to external services (Telegram API)

// Starts the Express app and adds middleware to parse JSON from incoming HTTP POST request bodies.
const app = express();
app.use(express.json());


// =====================================================================
// 2. PREPARING EXTERNAL CONNECTIONS (CLIENTS)
// =====================================================================

// Supabase (PostgreSQL) client
// Opens the database tunnel using the URL and Anon Key read from .env.
const supabase = createClient(
    process.env.SUPABASE_URL, 
    process.env.SUPABASE_KEY
);

// Nodemailer (Gmail) client
// Connects to the Gmail SMTP server using the Google App Password for authentication.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});


// =====================================================================
// 3. MAIN BRAIN: WEBHOOK LISTENING AND FILTERING
// =====================================================================

// Main route that listens for requests coming from outside (from OpenCVE)
app.post('/webhook', async (req, res) => {
  try {
    
    // Retrieves the 'changes' array from the incoming JSON. Uses an empty array fallback so it doesn't crash if empty.
    const alerts = req.body.changes || [];

    // A single package may contain multiple vulnerabilities (CVEs), so we iterate through them one by one.
    for (let alert of alerts) {
      
      // Extracts specific data from the deeper JSON levels (de-structuring/parsing)
      const cveId = alert.cve || "Unknown-CVE"; // Official vulnerability code
      const cvssScore = alert.details?.cvss?.v3 || 0; // Threat score (defaults to 0 if missing)
      const description = alert.details?.description || "Description not found."; 
      const vendor = alert.details?.vendors?.[0] || "Unknown"; // System/company
      const product = alert.details?.products?.[0] || "Unknown"; // Software

      // NOISE FILTER: Only high-severity vulnerabilities with a score of 8.0 and above are processed.
      if (cvssScore >= 8.0) {
        
        console.log(`[!] CRITICAL VULNERABILITY DETECTED: ${cveId} (Score: ${cvssScore})`);

        // GOAL 1: Persistent logging (Supabase PostgreSQL)
        // Adds a record to the vulnerability table for future analysis or auditing.
        await supabase.from('vulnerability_logs').insert([{
          cve_id: cveId,
          score: cvssScore,
          vendor_product: `${vendor}/${product}`,
          description: description
        }]);

        // GOAL 2: Detailed notification (Gmail)
        // Sends a classic email for longer text and technical details.
        const mailText = `Vulnerability: ${cveId}\nScore: ${cvssScore}\nSystem: ${vendor}/${product}\n\nDetails:\n${description}`;
        await transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: process.env.GMAIL_USER, // Sends an email to itself
          subject: `🚨 HUGINN ALERT: New Critical Vulnerability - ${cveId}`,
          text: mailText
        });

        // GOAL 3: Immediate alert (Telegram API)
        // Sends a message directly to the Telegram Bot API using Axios in Markdown format.
        await axios.post(
          `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text: `🚨 *CRITICAL VULNERABILITY (Score: ${cvssScore})*\n\n*ID:* ${cveId}\n*System:* ${vendor}/${product}\n\n${description}`,
            parse_mode: "Markdown" // Allows text to appear bold (*) or italic
          }
        );
        console.log(`[+] Telegram message sent successfully: ${cveId}`);
        
      } else {
        // If the score is below 8.0, we just log the information to the terminal and skip it without burdening the system.
        console.log(`[-] Low-score vulnerability skipped: ${cveId} (Score: ${cvssScore})`);
      }
    }

    // When processing is complete, we respond to OpenCVE with a "I received and processed the data" message.
    // If this is not returned, the remote server assumes the webhook crashed and resends the same data repeatedly.
    res.status(200).send("OK");

  } catch (error) {
    // FAIL-LOUD: If there is a problem with the DB, mail, or Telegram, do not stay silent.
    // Log the full details, including the actual error response from Axios (response.data), directly to the terminal.
    console.error("[ERROR] A problem occurred while processing the webhook.");
    console.error("Details:", error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    
    // Informs OpenCVE that something went wrong inside the server.
    res.status(500).send("Internal server error");
  }
});


// =====================================================================
// 4. SERVER STARTUP
// =====================================================================

// Uses port 3000 if no special port is specified in the .env file.
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🦅 Huginn woke up and is on standby on port ${PORT}...`);
});