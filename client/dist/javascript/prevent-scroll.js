// Function to reset the scroll position
function resetScrollPosition() {
  window.scrollTo(0, 0);
}

// Function to handle focus and blur events on input fields
function adjustForKeyboard() {
  const inputs = document.querySelectorAll('input, textarea, select');

  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      // Save the current scroll position and fix the body
      document.body.dataset.scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${window.scrollY}px`;
    });

    input.addEventListener('blur', () => {
      // Restore the scroll position and reset the body
      const scrollY = document.body.dataset.scrollY;
      document.body.style.position = '';
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0'));
    });
  });
}

// Function to handle form submit
function handleButtonClick() {
  const buttons = document.querySelectorAll('button');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      resetScrollPosition();
    });
  });
}

// Event listeners to reset scroll position on visibility change and focus
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    resetScrollPosition();
  }
});
window.addEventListener('focus', resetScrollPosition);

// Initialize keyboard adjustments and button click handling
window.addEventListener('load', () => {
  adjustForKeyboard();
  handleButtonClick();
  resetScrollPosition(); // Ensure position is reset on initial load
});
