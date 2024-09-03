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
    // Handle preflight CORS request
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Path to the CSV file
  const csvFilePath = "../../free-domains-2.csv";

  // Read and parse the CSV file
  const invalidEmailDomains = [];
  await new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        if (row.domain) {
          invalidEmailDomains.push(row.domain);
        }
      })
      .on('end', resolve)
      .on('error', reject);
  });

  const { emailDomain } = JSON.parse(event.body);

  const isInvalid = invalidEmailDomains.includes(emailDomain);

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ isInvalid }),
  };
};
