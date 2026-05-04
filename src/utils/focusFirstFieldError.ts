export const focusFirstFieldError = () => {
  setTimeout(() => {
    const firstErrorElement = document.querySelector('.focus-error');

    if (firstErrorElement) {
      firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const input = firstErrorElement.querySelector(
        'input, select, textarea'
      ) as HTMLElement;
      if (input) {
        input.focus();
      }
    }
  }, 100);
};
