import fs from 'fs'
import R from 'ramda'
import yamljs from 'yamljs'

let translations = {}

const config = yamljs.load('./config.yaml')

const path = R.curry((partial, lang) => [lang, yamljs.load(`${__dirname}/../partials/${partial}/lang-${lang}.yaml`)])

const mapFiles = R.map(path, config.site.partials)

const mapLanguages = f => R.map(lang => f(lang), config.languages)

const compose = ([lang, data]) => {
  if(typeof translations[lang] === 'undefined'){
    translations[lang] = {}
  }
  translations[lang] = {...translations[lang], ...data}
}

R.forEach(compose, R.unnest(R.map(mapLanguages, mapFiles)))

fs.writeFileSync(`${__dirname}/../js/phrases.json`, JSON.stringify(translations))
