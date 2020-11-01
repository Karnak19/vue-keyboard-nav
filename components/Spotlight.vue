<template>
  <div class="spotlight active">
    <div class="spotlight-bar">
      <form @submit.prevent="search">
        <input type="text" id="spotlight" placeholder="Want to navigate ?" v-model="input" @blur="blur" />
      </form>
      <ul class="spotlight-suggestions">
        <li v-for="r in suggestions" :key="r.id" :class="{ active: r.name === selectedSuggestion.name }">
          <router-link :to="r.path">{{ r.name }}</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref, toRefs, watch } from 'vue';
import { useRouter } from 'vue-router';

export default {
  props: {
    blur: Function,
    routes: Array,
  },
  setup(props) {
    const { routes } = toRefs(props);
    const router = useRouter();
    const input = ref('');
    const suggestions = ref([]);
    const selectedIndex = ref(0);
    const selectedSuggestion = ref('');

    // Create
    const mapRecursion = (array, parentPath = undefined) => {
      return array.map((el) => {
        const val = {
          ...el,
          path: parentPath ? parentPath + '/' + el.path : el.path,
        };
        delete val.component;
        if (val.children) {
          val.children = mapRecursion(val.children, val.path);
        }
        return val;
      });
    };

    // flat all children routes to a 0 depth array
    const flatten = (items) => {
      const flat = [];
      items.forEach((item) => {
        flat.push({ name: item.name, path: item.path });
        if (Array.isArray(item.children)) {
          flat.push(...flatten(item.children));
        }
      });
      return flat;
    };

    const flat = ref(flatten(mapRecursion(routes.value)).map((e) => e));

    // router redirection
    const search = () => {
      router.push(selectedSuggestion.value.path).then(() => {
        document.querySelector('#spotlight').blur();
      });
    };

    // Navigate on suggestions with arrow keys
    const pressKeys = (e) => {
      if (e.keyCode === 40) {
        // arrow DOWN
        if (selectedIndex.value >= suggestions.value.length - 1) {
          selectedIndex.value = 0;
        } else {
          selectedIndex.value = selectedIndex.value + 1;
        }
      }
      if (e.keyCode === 38) {
        // arrow UP
        selectedIndex.value = selectedIndex.value === 0 ? 0 : selectedIndex.value - 1;
      }

      // Escape key
      if (e.keyCode === 27) {
        document.querySelector('#spotlight').blur();
      }
    };

    // Filter the suggestion list from the input
    const filterSuggest = () => {
      return flat.value.filter((el) => {
        return el.name.includes(input.value);
      });
    };

    // Changes the selected suggestion reactively to arrow keys navigation
    watch(
      () => selectedIndex.value,
      () => {
        selectedSuggestion.value = suggestions.value[selectedIndex.value];
      }
    );

    // Changes the suggestion list to filtered one
    watch(
      () => input.value,
      () => {
        suggestions.value = filterSuggest();
        selectedSuggestion.value = suggestions.value[0];
      }
    );

    onMounted(() => {
      // High chances there is a better solution here
      document.querySelector('#spotlight').focus();
      document.addEventListener('keydown', pressKeys);
    });

    onUnmounted(() => {
      document.removeEventListener('keydown', pressKeys);
    });

    return { input, suggestions, selectedSuggestion, search };
  },
};
</script>

<style>
.spotlight {
  opacity: 0;
  pointer-events: none;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
  margin-top: -500px;
}

.spotlight.active {
  opacity: 1;
  pointer-events: auto;
}

.spotlight-bar {
  position: relative;
  width: 350px;
  background: whitesmoke;
  border-radius: 5px;
  padding: 5px;
}

.spotlight-bar input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  font-size: 16px;
  border: 1px solid rgba(0, 0, 0, 0.6);
}

.spotlight-suggestions {
  position: absolute;
  top: 100%;
  background: whitesmoke;
  left: 0;
  right: 0;
  margin: -5px 0 0 0;
  padding: 5px 0;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  text-align: left;
}

.spotlight-suggestions li {
  list-style: none;
  margin: 0;
  padding: 0;
}

.spotlight-suggestions a {
  display: block;
  text-decoration: none;
  padding: 10px 15px;
  color: inherit;
}

.spotlight-suggestions li:hover a {
  background: rgb(194, 194, 194);
}

.spotlight-suggestions li.active a {
  background: rgb(161, 161, 161);
}

.spotlight-suggestions li.active:hover a {
  background: rgb(122, 122, 122);
}
</style>
