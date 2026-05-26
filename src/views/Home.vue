<template>
  <div class="container" :class="{ centered: documents.length === 0 }">
    <div class="result_container">
      <div class="card" v-for="(document, i) in documents" :key="i">
        <div>
          <b>Title: {{ document.title }}</b>
        </div>
        <div style="margin-top: 10px">
          <b
            >Link:
            <a :href="document.url" target="_blank">
              {{ document.url }}
            </a>
          </b>
        </div>
        <div style="margin-top: 10px">
          <b>Content:</b>
          {{ document.expanded ? document.content : document.content?.slice(0, 500) }}

          <span v-if="!document.expanded && document.content.length >= 500"> ... </span>
        </div>
        <div
          style="margin-top: 10px; cursor: pointer"
          @click="document.expanded = !document.expanded"
          v-if="document.content.length >= 500"
        >
          <b>
            {{ document.expanded ? 'Show less' : 'Show more' }}
          </b>
        </div>
      </div>
    </div>
    <div class="searchbar" :class="{ fixed: documents.length > 0 }">
      <div style="display: flex">
        <v-input
          rounded
          @keydown.enter="search"
          width="50vw"
          v-model="query"
          label="Ask anything"
        ></v-input>
        <button class="button" @click="search" style="margin-left: 10px">Search</button>
      </div>
    </div>
    <v-overlay v-model="overlay"></v-overlay>
    <v-snackbar v-model="message"></v-snackbar>
  </div>
</template>
<script>
import { retrieveDocuments } from '@/services/retrievalService'
export default {
  data() {
    return {
      overlay: false,
      message: '',
      query: '',
      documents: [],
    }
  },

  methods: {
    async search() {
      if (!this.query || this.query.trim().length < 5) {
        this.message = 'Please enter at least 5 characters'

        return
      }
      try {
        this.overlay = true

        const result = await retrieveDocuments(this.query)

        this.documents = result.documents.map((document) => ({
          ...document,
          expanded: false,
        }))
      } catch (error) {
        console.log(error)

        this.message = 'Search error'
      } finally {
        this.overlay = false
      }
    },
  },

  mounted() {},
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container.centered {
  justify-content: center;
}

.result_container {
  overflow-y: auto;
  padding: 20px;
  padding-bottom: 100px;
}

.searchbar {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.searchbar.fixed {
  background-color: rgb(202, 202, 202);
  border-top: 2px solid rgb(104, 104, 104);

  position: fixed;
  bottom: 0;
  left: 0;

  width: 100%;

  box-sizing: border-box;
}

.button {
  padding: 8px 14px;
  border: 1px solid #898888;
  border-radius: 8px;
  cursor: pointer;

  background: white;

  transition: 0.2s;
}

.button:hover {
  background: #dcdcdc;
}

.card {
  padding: 15px;
  border: 2px solid rgb(104, 104, 104);
  border-radius: 10px;
  background-color: rgb(202, 202, 202);
  margin-top: 10px;
}
</style>