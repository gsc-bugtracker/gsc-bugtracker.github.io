setInterval(() => {
  const dialogs = document.querySelectorAll('md-dialog[type="alert"]');
  console.log(`Found ${dialogs.length} alert dialog(s)`);
  dialogs.forEach(dialog => { dialog.remove(); });
}, 1000);