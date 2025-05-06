document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    if (form && form.action.includes('/process')) {
      form.addEventListener('submit', (e) => {
        const signalInput = document.querySelector('#signal').value;
        if (!signalInput.includes(',')) {
          alert('Please enter comma-separated numbers');
          e.preventDefault();
        }
      });
    }
  });