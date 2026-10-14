const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: fs.createReadStream('C:/Users/HP/.gemini/antigravity-ide/brain/3a83a3aa-c80c-46c9-b73d-980d148d053b/.system_generated/logs/transcript.jsonl'),
  crlfDelay: Infinity
});

let lastUserStep = null;
rl.on('line', (line) => {
  try {
    const obj = JSON.parse(line);
    if (obj.type === 'USER_INPUT') {
      lastUserStep = obj;
    }
  } catch (e) {}
});

rl.on('close', () => {
  console.log('Last user step:', JSON.stringify(lastUserStep, null, 2));
});
