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

  console.log(`CSV File Path: ${csvFilePath}`);
  if (!fs.existsSync(csvFilePath)) {
    console.error(`CSV file not found at: ${csvFilePath}`);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'CSV file not found' }),
    };
  }

  // Read and parse the CSV file
  const invalidEmailDomains = [];
  try {
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
