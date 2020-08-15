const expect = chai.expect
import Vue from 'vue'
import Input from '../src/input'

Vue.config.productionTip = false
Vue.config.devtools = false

describe('Input', () => {
  const Constructor = Vue.extend(Input)
  let vm
  afterEach(function () {
    if (vm) {
      vm.$destroy()
    }
  })

  it('存在.', () => {
    expect(Input).to.exist
  })

  describe('props', () => {
    it('接收 value', function () {
      vm = new Constructor({
        propsData: {
          value: '1234'
        }
      }).$mount()

      const inputElement = vm.$el.querySelector('input')
      expect(inputElement.value).to.equal('1234')
    })

    it('接收 disabled', function () {
      vm = new Constructor({
        propsData: {
          disabled: true
        }
      }).$mount()

      const inputElement = vm.$el.querySelector('input')
      expect(inputElement.disabled).to.equal(true)
    })

    it('接收 readonly', function () {
      vm = new Constructor({
        propsData: {
          readonly: true
        }
      }).$mount()

      const inputElement = vm.$el.querySelector('input')
      expect(inputElement.readOnly).to.equal(true)
    })

    it('接收 error', function () {
      vm = new Constructor({
        propsData: {
          error: '你错了'
        }
      }).$mount()

      const useElement = vm.$el.querySelector('use')
      expect(useElement.getAttribute('xlink:href')).to.equal('#s-info')

      const errorMessage = vm.$el.querySelector('.error-message')
      expect(errorMessage.innerText).to.equal('你错了')
    })
  })

  describe('events', () => {
    it('支持 change/input/focus/blur 事件', function () {
      ['change', 'input', 'focus', 'blur'].forEach(e => {
        vm = new Constructor({}).$mount()
        const callback = sinon.fake()
        vm.$on(e, callback)
        // 触发 input 的 change 事件
        let event = new Event(e)
        let inputElement = vm.$el.querySelector('input')
        Object.defineProperty(event, 'target', {
          value: {
            value: 'hi'
          }
        })
        inputElement.dispatchEvent(event)
        expect(callback).to.have.been.calledWith('hi')
      })
    })
  })
})
