<template>
  <div class="container" :class="{ centered: documents.length === 0 }">
    <div class="result_container">
      <div class="card" v-if="answer">
        <div>
          <b>Answer:</b>
        </div>
        <div style="margin-top: 10px; white-space: pre-wrap">
          {{ answer }}
        </div>
      </div>
      <div class="card" v-for="(document, i) in documents" :key="i">
        <div>
          <b>Score: {{ (document.score * 100).toFixed(1) }}%</b>
        </div>
        <div style="margin-top: 10px">
          <b>Provider:</b> {{ document.provider }} <b>| Source: </b>{{ document.source_type }}
          <b>| Content: </b>{{ document.content_type }} <b>| Reliability: </b
          >{{ document.source_reliability }}%
          <b><span v-if="document.search_engine"> | Engine: </span></b>{{ document.search_engine }}
          <b><span v-if="document.search_category"> | Category: </span></b
          >{{ document.search_category }}
          <b><span v-if="document.published_at"> | Published: </span></b>{{ document.published_at }}
        </div>
        <div style="margin-top: 10px">
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
      <div style="display: flex; flex-direction: column">
        <div style="display: flex">
          <v-autocomplete
            v-model="selected_provider"
            :items="providers"
            width="10vw"
            label="Provider"
            style="margin-bottom: 10px"
          ></v-autocomplete>

          <v-autocomplete
            v-model="selected_retrieval_mode"
            :items="retrieval_modes"
            width="10vw"
            label="Retrieval"
            style="margin-bottom: 10px"
          ></v-autocomplete>
        </div>

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
      answer: '',
      documents: [],
      similar_chunks: [],
      selected_provider: 'searxng',
      providers: ['searxng', 'ddgs', 'exa'],
      selected_retrieval_mode: 'semantic',
      retrieval_modes: ['semantic', 'lexical'],
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

        const result = await retrieveDocuments(
          this.query,
          this.selected_provider,
          this.selected_retrieval_mode
        )

        this.answer = result.answer

        this.documents = result.documents.map((document) => ({
          ...document,
          expanded: false,
        }))
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      } catch (error) {
        console.log(error)

        this.message = error.message
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
  padding-top: 120px;
}

.searchbar {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.searchbar.fixed {
  background-color: rgb(202, 202, 202);
  border-bottom: 2px solid rgb(104, 104, 104);

  position: fixed;
  top: 0;
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
