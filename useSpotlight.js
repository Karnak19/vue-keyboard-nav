const { onMounted, onUnmounted, ref } = require('vue');

/**
 *
 * @param {boolean} activeRef
 */

function useSpotlight() {
  const isActive = ref(false);

  const keyboardShortcut = () => {
    onMounted(() => {
      window.addEventListener('keydown', (e) => {
        if (e.key === 'k' && e.ctrlKey) {
          e.preventDefault();
          isActive.value = true;
        }
      });
    });

    onUnmounted(() => {
      window.addEventListener('keydown', (e) => {
        if (e.key === 'k' && e.ctrlKey) {
          e.preventDefault();
          isActive.value = true;
        }
      });
    });
  };
  const blur = (timeout = 200) => {
    setTimeout(() => {
      isActive.value = false;
    }, timeout);
  };

  return {
    isActive,
    keyboardShortcut,
    blur,
  };
}

export default useSpotlight;
