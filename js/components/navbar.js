import fade from 'ractive-transitions-fade'
import Ractive from 'ractive'
//import R from 'ramda'
import template from '../../partials/navbar/index.html'


const header = Ractive.extend({
  template,
  // oninit: function(){
  //   this.on('headerClick', function() {
  //     let toggle = this.root.get('showNewsletterForm')
  //     this.root.set('showNewsletterForm', !toggle)
  //   })
  // },
})


export default header
