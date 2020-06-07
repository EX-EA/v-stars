import Vue from 'vue'
import Button from './button.vue'
import Icon from './icon.vue'
import ButtonGroup from './button-group'
import chai from 'chai'
import spies from 'chai-spies'

chai.use(spies)

Vue.component('s-button', Button)
Vue.component('s-button-group', ButtonGroup)
Vue.component('s-icon', Icon)

new Vue({
  el: '#app',
  data: {
    loading: false,
    loading1: false,
    loading2: false,
  }
})

const expect = chai.expect
{
  const Constructor = Vue.extend(Button)
  const vm = new Constructor({
    propsData: {
      icon: 'setting'
    }
  }).$mount()
  const use = vm.$el.querySelector('use')
  expect(use.getAttribute('xlink:href')).to.equal('#s-setting')
  vm.$destroy()
}
{
  const Constructor = Vue.extend(Button)
  const vm = new Constructor({
    propsData: {
      icon: 'setting',
      loading: true
    }
  }).$mount()
  const use = vm.$el.querySelector('use')
  expect(use.getAttribute('xlink:href')).to.equal('#s-loading')
  vm.$destroy()
}
{
  const div = document.createElement('div')
  document.body.appendChild(div)
  const Constructor = Vue.extend(Button)
  const vm = new Constructor({
    propsData: {
      icon: 'setting',
      loading: true
    }
  }).$mount(div)
  const svg = vm.$el.querySelector('svg')
  expect(getComputedStyle(svg).order).to.equal('1')
  vm.$destroy()
  vm.$el.remove()
}
{
  const div = document.createElement('div')
  document.body.appendChild(div)
  const Constructor = Vue.extend(Button)
  const vm = new Constructor({
    propsData: {
      icon: 'setting',
      iconPosition: 'right'
    }
  }).$mount(div)
  const svg = vm.$el.querySelector('svg')
  expect(getComputedStyle(svg).order).to.equal('2')
  vm.$destroy()
  vm.$el.remove()
}
{
  // mock
  const Constructor = Vue.extend(Button)
  const vm = new Constructor({
    propsData: {
      icon: 'setting',
      iconPosition: 'right'
    }
  }).$mount()
  const spy = chai.spy(function () {})
  vm.$on('click', spy)
  vm.$el.click() // 触发点击
  expect(spy).to.have.been.called()
  vm.$destroy()
  vm.$el.remove()
}
