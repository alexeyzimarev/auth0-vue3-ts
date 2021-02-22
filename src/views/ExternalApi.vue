<template>
  <div>
    <div class="mb-5">
      <h1>External API</h1>
      <p>
        Call an external API by clicking the button below. This will call the external API using an access token, and
        the API will validate it using
        the API's audience value.
      </p>

      <button class="btn btn-primary mt-5" @click="callApi">Call API</button>
    </div>

    <div class="result-block-container">
      <div :class="['result-block', executed ? 'show' : '']">
        <h6 class="muted">Result</h6>
        {{ JSON.stringify(apiMessage, null, 2) }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
    name: "Api",
    data() {
        return {
            apiMessage: null,
            executed:   false
        };
    },
    inject:  ['Auth'],
    methods: {
        async callApi() {
            const accessToken = await this.Auth.getTokenSilently();

            try {
                const {data} = await axios.get("http://localhost:5000/api/claims", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                this.apiMessage = data;
                this.executed   = true;
            } catch (e) {
                this.apiMessage = `Error: the server responded with '${e.response.status}: ${e.response.statusText}'`;
            }
        }
    }
};
</script>
