const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Path to the CSV file
  const csvFilePath = path.join(__dirname, 'free-domains-2.csv');

  const invalidEmailDomains = [];
  try {
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv({ headers: false }))  // Disable headers
        .on('data', (row) => {
          // Assuming the first column contains the domain
          const domain = Object.values(row)[0];
          if (domain) {
            invalidEmailDomains.push(domain);
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });
  } catch (error) {
    console.error('Error reading CSV file:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to read CSV file' }),
    };
  }

  const { emailDomain } = JSON.parse(event.body);
  const isInvalid = invalidEmailDomains.includes(emailDomain);

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ isInvalid }),
  };
};
