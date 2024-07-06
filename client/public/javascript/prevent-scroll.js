// Function to prevent scrolling
function preventDefault(e) {
  e.preventDefault();
}

// Function to lock scroll
function disableScroll() {
  document.body.style.overflow = 'hidden';
  document.addEventListener('touchmove', preventDefault, { passive: false });
}

// Function to enable scroll
function enableScroll() {
  document.body.style.overflow = '';
  document.removeEventListener('touchmove', preventDefault, { passive: false });
}

// Function to handle focus and blur events on input fields
function adjustForKeyboard() {
  const inputs = document.querySelectorAll('input, textarea, select');

  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      document.body.style.position = 'fixed';
      document.body.style.top = `-${window.scrollY}px`;
    });

    input.addEventListener('blur', () => {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
      resetScrollPosition();
    });
  });
}

// Function to reset scroll position
function resetScrollPosition() {
  window.scrollTo(0, 0);
}

// Event listeners to reset scroll position on visibility change and focus
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    resetScrollPosition();
  }
});
window.addEventListener('focus', resetScrollPosition);

// Initialize scroll locking and keyboard adjustments
window.addEventListener('load', () => {
  disableScroll();
  adjustForKeyboard();
});
