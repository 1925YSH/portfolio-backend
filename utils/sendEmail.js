const sendEmail = async (options) => {
  // Using the Web3Forms Access Key provided by the user
  const WEB3FORMS_ACCESS_KEY = process.env.WEB3FORMS_ACCESS_KEY || "eb782e85-8b0f-4244-96f1-1d0acc742cb1";

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: options.subject || `New Contact Message from ${options.name}`,
      from_name: options.name,
      email: options.email, // This is the sender's email
      message: options.message,
    }),
  });

  const data = await response.json();
  
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to send email via Web3Forms");
  }

  console.log("✅ Email sent successfully via Web3Forms");
};

module.exports = sendEmail;
