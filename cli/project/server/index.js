const express = require('express');
const defrost = require('@alex-schuster/defrost');
const fs = require('fs');
const template = fs.readFileSync('./templates/index.template.html').toString();

const app = express();
const port = 8080;
const data = { lang: 'en', foo: 'world' };
const output = defrost.render(template, data);

app.get('/', (req, res) => {
  res.send(output);
});
app.listen(port, () => { console.log(`Listening on port ${port}`) });
app.use(express.static(process.cwd() + '/dist'));
