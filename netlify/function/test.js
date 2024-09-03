exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    // Handle preflight CORS request
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  const invalidEmailDomains = [
    '0-mail.com',
    '027168.com',
    '0815.su',
    '0sg.net',
    '10mail.org',
    '10minutemail.co.za',
    '11mail.com',
    '123.com'
  ];

  const { emailDomain } = JSON.parse(event.body);

  const isInvalid = invalidEmailDomains.includes(emailDomain);

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ isInvalid }),
  };
};
