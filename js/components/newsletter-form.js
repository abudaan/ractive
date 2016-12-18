import fade from 'ractive-transitions-fade'
import Ractive from 'ractive'
//import R from 'ramda'
import template from '../../partials/newsletter-form/index.html'


const form = Ractive.extend({
  template,
  oninit: function(){
    this.on('validateForm', function() {
      window.alert('to purescript (in due course)')
    })
  },
})

form.transitions.fade = fade

export default form

