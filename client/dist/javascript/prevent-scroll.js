// Function to reset the scroll position
function resetScrollPosition() {
  window.scrollTo(0, 0);
}

// Handler for the visibilitychange event
function handleVisibilityChange() {
  if (document.visibilityState === 'visible') {
    resetScrollPosition();
  }
}

// Handler for the focus event
function handleFocus() {
  resetScrollPosition();
}

// Function to handle the appearance and hiding of the keyboard
function adjustForKeyboard() {
  const inputs = document.querySelectorAll('input, textarea, select');

  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      document.body.style.position = 'fixed';
      document.body.style.top = `-${window.scrollY}px`;
    });

    input.addEventListener('blur', () => {
      document.body.style.position = '';
      document.body.style.top = '';
      resetScrollPosition();
    });
  });
}

// Add event handlers
document.addEventListener('visibilitychange', handleVisibilityChange);
window.addEventListener('focus', handleFocus);

// Scroll locking
function preventDefault(e) {
  e.preventDefault();
}

function disableScroll() {
  document.addEventListener('touchmove', preventDefault, { passive: false });
}

function enableScroll() {
  document.removeEventListener('touchmove', preventDefault, { passive: false });
}

// Initialize scroll locking and keyboard adjustments
window.addEventListener('load', () => {
  disableScroll();
  adjustForKeyboard();
});
