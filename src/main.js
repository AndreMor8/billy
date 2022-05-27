import 'bulma/css/bulma.css';
import { createApp } from 'vue';
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App.vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faYoutube, faTwitter, faDiscord, faWindows } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faUser, faCirclePlus, faList, faCircleCheck, faAlignLeft, faTrashCan, faShuffle, faEnvelopeOpen, faUserShield, faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import router from './router';
import apiDomain from './domain';
window.apiDomain = apiDomain;
library.add(faYoutube, faTwitter, faDiscord, faWindows, faEnvelope, faUser, faCirclePlus, faList, faCircleCheck, faAlignLeft, faTrashCan, faShuffle, faEnvelopeOpen, faUserShield, faArrowRotateRight);
createApp(App).component("font-awesome-icon", FontAwesomeIcon).use(router).use(VueAxios, axios).mount('#app');