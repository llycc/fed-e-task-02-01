#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const templateJson = require('./projectTpl');

class SimpleNodeClient {
  constructor(config = { input: process.stdin, output: process.stdout}) {
    this.terminal = readline.createInterface(config);
  }
  question(questionDesc) {
    return new Promise((resolve, reject) => {
      this.terminal.question(questionDesc, answer => {
        resolve(answer);
      })
    });
  }
  close() {
    this.terminal.close();
  }
  async runQuestions(questions) {
    const results = [];
    for(let question of questions) {
      const result = await this.question(question.desc)
      results.push({[question.key]: result});
    }
    return results
  }
}



const questions = [
  { desc: 'project name:', key: 'name', result: ''},
  { desc: 'version(1.0.0):', key: 'version', result: ''},
  { desc: 'description:', key: 'description', result: ''},
  { desc: 'keywords:', key: 'keywords', result: ''},
  { desc: 'author:', key: 'author', result: ''},
  { desc: 'main(index.js):', key: 'main', result: ''},
  { desc: 'license(ISC):', key: 'license', result: ''}
];

const simpleNodeClient = new SimpleNodeClient();
simpleNodeClient.runQuestions(questions).then((results) => {
  results.forEach((key) => {
    if (!results[key]) {
      return;
    }
    templateJson[key] = results[key];
  });

  const content = JSON.stringify(templateJson, null, '\t');
  simpleNodeClient.terminal.write(content);
  simpleNodeClient.terminal.write('\nPlease wait a moment...')

  fs.writeFileSync('./project.json', content);
  simpleNodeClient.terminal.write('\ncreate project.json over');
  simpleNodeClient.close()
});
