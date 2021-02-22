import {createApp} from "vue";
import App from "./App.vue";
import router from "./router";
import {Auth0} from "@/auth";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faLink, faUser, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

async function init() {
    const AuthPlugin = await Auth0.init({
        onRedirectCallback: (appState) => {
            router.push(
                appState && appState.targetUrl
                    ? appState.targetUrl
                    : window.location.pathname,
            )
        },
        clientId: process.env.VUE_APP_AUTH0_CLIENT_KEY,
        domain: process.env.VUE_APP_AUTH0_DOMAIN,
        audience: process.env.VUE_APP_AUTH0_AUDIENCE,
        redirectUri: window.location.origin,
    });
    const app = createApp(App);
    library.add(faLink, faUser, faPowerOff);
    app
        .use(AuthPlugin)
        .use(router)
        .component("font-awesome-icon", FontAwesomeIcon)
        .mount('#app');
}

init();
