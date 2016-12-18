import 'babel-polyfill'
import createApp from './app'


window.onload = function(){
  createApp({
    el: '#app',
    language: 'en',
  })
}

