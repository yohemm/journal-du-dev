const fs = require('node:fs');
fs.readFile('copy.html', 'utf-8',(err, res) => {
  if (err) throw data;
  res.replaceAll('\'', "%26");
  res.replaceAll("\"", "%22");
  console.log(res)
  fs.write('resultat.nothtml', res, (err) => {
    if (err) throw err;
    console.log('mission effectuer')
  })
})