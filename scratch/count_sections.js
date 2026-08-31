const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'src', 'data', 'university_data.json');
const rawData = fs.readFileSync(dataPath, 'utf8');
const data = JSON.parse(rawData);

const courses = data.courses || data;

const sectionCount = {};
const statusCount = {};

courses.forEach(c => {
  const code = c.course_no;
  const name = c.name;
  const status = c.status; // '1' = open, '3' = closed

  if (!sectionCount[code]) {
    sectionCount[code] = { name, total: 0, open: 0, closed: 0 };
  }
  
  sectionCount[code].total++;
  if (status === '1') {
    sectionCount[code].open++;
  } else if (status === '3') {
    sectionCount[code].closed++;
  }
});

const sorted = Object.entries(sectionCount)
  .map(([code, info]) => ({ code, ...info }))
  .sort((a, b) => b.total - a.total);

console.log("TOP courses with multiple sections:");
sorted.slice(0, 15).forEach(c => {
  console.log(`- Code: ${c.code} | Name: ${c.name} | Total Sections: ${c.total} (Open: ${c.open}, Closed: ${c.closed})`);
});
