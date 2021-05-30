import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
//引入reset.css
import "./assets/css/reset.css"
//引入过滤器
import "./filters/index"
//引入公共组件
import "./components/index"
// 引入element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

//侧边栏颜色
Vue.prototype.$aside = "#20222A";

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
