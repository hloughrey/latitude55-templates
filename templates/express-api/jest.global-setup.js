require('ts-node/register');

process.env.CI = 'true';

// Jest global setup must export a function
module.exports = () => {
  console.log('Preparing test environment');
}