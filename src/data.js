const { randomUUID, randomInt } = require('node:crypto');

function person() {
  const id = randomUUID().replaceAll('-', '');
  const letters = id.replace(/[0-9]/g, digit => String.fromCharCode(97 + Number(digit)));
  return {
    firstName: `Ana${letters.slice(0, 8)}`,
    lastName: `Silva${letters.slice(8, 16)}`,
    email: `qa.${id}@example.com`,
    age: String(randomInt(18, 65)),
    salary: String(randomInt(2000, 15000)),
    department: `Qualidade${letters.slice(0, 6)}`,
    mobile: `9${randomInt(100000000, 1000000000)}`,
    address: `Rua de Teste, ${randomInt(1, 9999)}`,
    gender: ['Male', 'Female', 'Other'][randomInt(0, 3)],
    birthDay: String(randomInt(10, 28)),
    birthMonth: String(randomInt(0, 12)),
    birthYear: String(randomInt(1980, 2006)),
    subject: ['Maths', 'English', 'Physics'][randomInt(0, 3)],
    hobby: ['Sports', 'Reading', 'Music'][randomInt(0, 3)],
    state: 'NCR',
    city: ['Delhi', 'Gurgaon', 'Noida'][randomInt(0, 3)]
  };
}

function credentials() {
  return { userName: `qa_${randomUUID()}`, password: `Qa!9${randomUUID()}aA` };
}

module.exports = { person, credentials };
