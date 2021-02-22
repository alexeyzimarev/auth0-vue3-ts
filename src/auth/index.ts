import createAuth0Client, {
    Auth0Client,
    GetIdTokenClaimsOptions,
    GetTokenSilentlyOptions,
    GetTokenWithPopupOptions,
    LogoutOptions,
    RedirectLoginOptions,
    User
} from '@auth0/auth0-spa-js'
import {App, Plugin, computed, reactive, watchEffect} from 'vue'
import {NavigationGuardWithThis} from "vue-router";

let client: Auth0Client;

interface Auth0PluginState {
    loading: boolean,
    isAuthenticated: boolean;
    user: User | undefined,
    popupOpen: boolean;
    error: any
}

const state = reactive<Auth0PluginState>({
    loading: true,
    isAuthenticated: false,
    user: {},
    popupOpen: false,
    error: null,
})

async function handleRedirectCallback() {
    state.loading = true;

    try {
        await client.handleRedirectCallback();
        state.user = await client.getUser();
        state.isAuthenticated = true;
    } catch (e) {
        state.error = e;
    } finally {
        state.loading = false;
    }
}

function loginWithRedirect(o: RedirectLoginOptions) {
    return client.loginWithRedirect(o);
}

function getIdTokenClaims(o: GetIdTokenClaimsOptions) {
    return client.getIdTokenClaims(o);
}

function getTokenSilently(o: GetTokenSilentlyOptions) {
    return client.getTokenSilently(o);
}

function getTokenWithPopup(o: GetTokenWithPopupOptions) {
    return client.getTokenWithPopup(o);
}

function logout(o: LogoutOptions) {
    return client.logout(o);
}

const authPlugin = {
    isAuthenticated: computed(() => state.isAuthenticated),
    loading: computed(() => state.loading),
    user: computed(() => state.user),
    getIdTokenClaims,
    getTokenSilently,
    getTokenWithPopup,
    handleRedirectCallback,
    loginWithRedirect,
    logout,
}

const routeGuard: NavigationGuardWithThis<undefined> = (to: any, from: any, next: any) => {
    const {isAuthenticated, loading, loginWithRedirect} = authPlugin;

    const verify = async () => {
        // If the user is authenticated, continue with the route
        if (isAuthenticated.value) {
            return next();
        }

        // Otherwise, log in
        await loginWithRedirect({appState: {targetUrl: to.fullPath}});
    }

    // If loading has already finished, check our auth state using `fn()`
    if (!loading.value) {
        return verify();
    }

    // Watch for the loading property to change before we check isAuthenticated
    watchEffect(() => {
        if (!loading.value) {
            return verify();
        }
    })
}

interface Auth0PluginOptions {
    domain: string,
    clientId: string,
    audience: string,
    redirectUri: string,

    onRedirectCallback(appState: any): void
}

async function init(options: Auth0PluginOptions): Promise<Plugin> {
    client = await createAuth0Client({
        // domain: process.env.VUE_APP_AUTH0_DOMAIN,
        // client_id: process.env.VUE_APP_AUTH0_CLIENT_KEY,
        domain: options.domain,
        client_id: options.clientId,
        audience: options.audience,
        redirect_uri: options.redirectUri,
    });

    try {
        // If the user is returning to the app after authentication
        if (
            window.location.search.includes('code=') &&
            window.location.search.includes('state=')
        ) {
            // handle the redirect and retrieve tokens
            const {appState} = await client.handleRedirectCallback();

            // Notify subscribers that the redirect callback has happened, passing the appState
            // (useful for retrieving any pre-authentication state)
            options.onRedirectCallback(appState);
        }
    } catch (e) {
        state.error = e;
    } finally {
        // Initialize our internal authentication state
        state.isAuthenticated = await client.isAuthenticated();
        state.user = await client.getUser();
        state.loading = false;
    }

    return {
        install: (app: App) => {
            app.provide('Auth', authPlugin);
        },
    }
}

interface Auth0Plugin {
    init(options: Auth0PluginOptions): Promise<Plugin>;
    routeGuard: NavigationGuardWithThis<undefined>
}

export const Auth0: Auth0Plugin = {
    init,
    routeGuard
}
