export default async function handler(req, res) {
  const code = req.query.code;
  const client_id = process.env.GITHUB_CLIENT_ID;
  const client_secret = process.env.GITHUB_CLIENT_SECRET;

  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ client_id, client_secret, code }),
    });

    const data = await response.json();
    const token = data.access_token;

    const content = JSON.stringify({ token, provider: 'github' });
    const html = `
      <!DOCTYPE html>
      <html>
      <body>
      <script>
        window.opener.postMessage('authorization:github:success:${content}', '*');
        window.close();
      </script>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    res.status(500).send('Authentication Error');
  }
}
