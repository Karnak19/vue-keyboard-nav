# vue-keyboard-nav

## Requirements

Vue 3

## Getting started

```bash
npm install vue-keyboard-nav
```

First, you have to export your router routes to import it where you are going to invoke the Spotlight component. I suggest you to do it in your App.vue.

router.js

```javascript
// example
export const routes = [
  { name: 'home', path: '/', component: Home },
  {
    name: 'user',
    path: '/user',
    component: User,
    children: [
      { name: 'dashboard', path: 'dashboard', component: UserDashboard },
      { name: 'profile', path: 'profile', component: UserProfile },
    ],
  },
  { name: 'products', path: '/products', component: Products },
  { name: 'contact', path: '/contact', component: Contact },
];
```

App.vue

```Vue
<template>
  <router-view></router-view>
  <Spotlight v-if="isActive" :blur="blur" :routes="routes" />
</template>

<script>
import { useSpotlight, Spotlight } from 'vue-keyboard-nav';
import { routes } from '@/router';

export default {
  name: 'App',
  components: {
    Spotlight,
  },
  setup() {
    const { isActive, blur, keyboardShortcut } = useSpotlight();

    keyboardShortcut();

    return { isActive, blur, routes };
  },
};
</script>
```

Then export your `routes`, aswell as `isActive` and `blur` from your setup function, to pass it as props to the `<Spotlight>` component.

## Keybinds
`ctrl + k` : Open the spotlight

while Spotlight is opened: 
`Escape` : close the Spotlight
`Arrow key up/down` : navigate in the filtered list
`Enter` : Validate your active choice, close the Spotlight and redirect to your selected choice.
