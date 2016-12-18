import fade from 'ractive-transitions-fade'
import Ractive from 'ractive'
import template from '../pages/home.html'
import header from './components/header'
import navbar from './components/navbar'
import newsletterForm from './components/newsletter-form'
import phrases from './phrases.json'


// set global fade
Ractive.transitions.fade = fade

const createApp = config => {

  let {
    el,
    language = 'nl',
  } = config

  const app = new Ractive({
    el,
    template,
    components: {
      newsletterForm,
      header,
      navbar,
    },
    data: {
      language,
      i18n: null,
      newsletterForm: {
        show: false,
        firstName: null,
        lastName: null,
        email: null,
        country: null,
        language: null,
        gender: null,
      }
    },
    oninit() {
      this.set('i18n', phrases[this.get('language')])
      console.log(this.get('i18n'))
    }
  })

  app.on({
    'navbar.showNewsletterForm': function(e){
      this.set('newsletterForm.show', !this.get('newsletterForm.show'))
    },
    'navbar.setLanguage': function(e){
      let target = e.original.target
      let lang = target.options[target.selectedIndex].id
      this.set('language', lang)
      this.set('i18n', phrases[lang])
    }
  })

  return app
}


export default createApp
