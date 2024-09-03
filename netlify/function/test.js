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

exports.handler = async (event) => {
  const { emailDomain } = JSON.parse(event.body);
  
  const isInvalid = invalidEmailDomains.includes(emailDomain);

  return {
    statusCode: 200,
    body: JSON.stringify({ isInvalid }),
  };
};
