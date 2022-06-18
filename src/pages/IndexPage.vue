<template>
  <q-page class="row flex-center">
    <div class="column flex-center items-center">
      <q-input outlined
                item-aligned
                autogrow
                class='input-style'
                v-model.trim='value'
                label='Digite o nome de um pokemon'
                :rules="[val => !!val || 'É necessário digitar um nome']">
      </q-input>
      <q-btn label='pesquisar pokemon'
              outline class='q-ma-md'
              color='primary'
              @click='filterPokemon(value)'></q-btn>
      <div v-if='pokemon.name' class="row flex-center overlay-primary">
        <div class='column items-center'>
          <span class='text-h4 q-ma-sm'> {{ pokemon.name[0].toUpperCase() + pokemon.name.substring(1)}} </span>
          <q-img :src='pokemon.sprites.front_default' class='img-size'></q-img>
          <div class='column'>
            <span class='text-h6'> {{ typeTitle }} </span>
            <div v-for='({type}, index) in pokemonTypes' class='row justify-around'
                  :key='index'>
              <span> {{ type.name }} </span>
            </div>
        </div>
        </div>
        <div v-if='items.length' class='column justify-center'>
          <span class='text-h6 text-center'> {{ itemTitle }} </span>
          <div v-for='(item, index) in items' class='column items-center q-mx-sm'
                :key='index'>
            <q-img :src='item.sprites.default' class='item-size'></q-img>
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { useQuasar } from 'quasar'
import { defineComponent } from 'vue'
import {getPokemon, getItem} from '../../api/index'

export default defineComponent({
  setup () {
    const $q = useQuasar()
    $q.loading.show({
    delay: 3000 // ms
  })
  $q.loading.hide()
    return {
      showNotif () {
        $q.notify({
          message: 'Esse pokemon não existe',
          color: 'negative'
        })
      }
    }
  },
  name: 'IndexPage',
  components: {
  },
  data: () => ({
    value: '',
    pokemon: {},
    items: {},
  }),
  computed: {
    typeTitle() {
      return this.pokemon.types.length > 1 ? 'Tipos:' : 'Tipo:';
    },
    itemTitle() {
      return this.pokemon.held_items.length > 1 ? 'Itens:' : 'Item:';
    },
    pokemonTypes() {
      return this.pokemon.types;
    },
  },
  methods: {
    async filterPokemon(value) {
      try {

        this.$q.loading.show()
        let search = value.toLowerCase()
        const data = await getPokemon(search).then((res) => res.json())
        this.pokemon = data
        const pokeItems = await Promise.all(
          this.pokemon.held_items.map((i) => {
          let url = i.item.url
          return getItem(url).then((res) => res.json())
          })
        )
        this.items = pokeItems
      } catch {
        this.showNotif()
      } finally {
        this.$q.loading.hide()
      }
    }
  },
})
</script>

<style lang='stylus'>
.input-style
  width 300px
.img-size
  width 200px
  height 200px
.item-size
  width 80px
  height 50%
.types-size
  width 100px

.overlay-primary
  background rgba(38, 166, 154, 0.3)
  border-width 4px
  border-style solid
  border-color #26A69A

</style>
