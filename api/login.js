export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const { username, password } = req.body;

    // Credentials
    const CORRECT_USERNAME = process.env.ADMIN_USERNAME || "ginamntclaire";
    const CORRECT_PASSWORD = process.env.ADMIN_PASSWORD || "57Cxt4QXud5RXYSSfuQsDvMKqa6rimvUJBaJF75HVU8Zqf4HDv9qAj5nfMedETXfDgAAJZtWZYkr6mqZQtdu7y5r";

    // Validate credentials
    if (username === CORRECT_USERNAME && password === CORRECT_PASSWORD) {
      const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token: token
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}
