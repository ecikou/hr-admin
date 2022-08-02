// import Vue from 'vue'
// // 自定义的指令，页面中用v-imgerror（自己定义的名）调用 可以让所有页面调用
// Vue.directive('imgerror', {
//   // inserted (el, binding) {
//   //   el.src = 'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
//   // },
//   update (el, binding) {
//     el.src = 'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
//   }
// })

export const imgerror = {
  update (el, binding) {
    el.onerror = function () {
      this.src = 'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
    }
  }
}
