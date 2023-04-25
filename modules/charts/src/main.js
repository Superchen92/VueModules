import { createApp } from 'vue';
import App from './App.vue';
// import charts from '../dist/charts.es';
import charts from '../packages/';

createApp(App).use(charts).mount('#app');
