const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');

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

  try {
    // Log the current directory and its contents
    console.log('Current directory:', __dirname);
    console.log('Directory contents:', fs.readdirSync(__dirname));

    // Construct the path to the CSV file
    const csvFilePath = path.join(__dirname, 'free-domains-2.csv');
    console.log('Attempting to read file:', csvFilePath);

    // Check if the file exists
    if (!fs.existsSync(csvFilePath)) {
      console.error('CSV file not found:', csvFilePath);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'CSV file not found' }),
      };
    }

    // Read the CSV file content
    const csvContent = fs.readFileSync(csvFilePath, 'utf8');
    console.log('CSV file read successfully. First 100 characters:', csvContent.substring(0, 100));

    // Create a readable stream from the CSV content
    const readableStream = Readable.from(csvContent);

    const invalidEmailDomains = [];

    // Parse the CSV content
    await new Promise((resolve, reject) => {
      readableStream
        .pipe(csv())
        .on('data', (row) => {
          if (row.domain) {
            invalidEmailDomains.push(row.domain);
          }
        })
        .on('end', () => {
          console.log('CSV parsing complete. Number of domains:', invalidEmailDomains.length);
          resolve();
        })
        .on('error', (error) => {
          console.error('Error parsing CSV:', error);
          reject(error);
        });
    });

    const { emailDomain } = JSON.parse(event.body);
    const isInvalid = invalidEmailDomains.includes(emailDomain);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ isInvalid }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: error.message }),
    };
  }
};
