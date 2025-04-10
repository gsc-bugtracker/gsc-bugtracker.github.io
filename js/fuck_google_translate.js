document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('md-dialog[type="alert"]').forEach(dialog => dialog.remove());
});