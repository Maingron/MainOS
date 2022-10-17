if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('pwa2.js')
      .then(() => { console.log('Service Worker Registered'); });
  }