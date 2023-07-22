self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open('mainos-store').then((cache) => cache.addAll([
            'index.html',
            'scripts.js',
            'pwa1.js',
            'manifest.json',
            'img/.nomedia',
            'img/logo.svg',
            'img/mobile-logo.png',
            'img/transparent.png',
            'img/apple-icon-144x144.png',
            'style.css',
            'logo.png',
            'helper.js',
            'helper.min.css',
            'functions-programs.js',
            'mainos/iofs.js',
            'Program Files/Explorer/Start/exec.html',
            'Program Files/Explorer/Start/scripts.js',
            'Program Files/Explorer/Start/startmenu.css',
            'Program Files/Explorer/inner/exec.html',
            'Program Files/Explorer/inner/innerexplorer.js',
            'Program Files/Explorer/inner/explorerstyle.css',
            'Program Files/settings/exec.html',
            'Program Files/settings/scripts.js',
            'Program Files/settings/style.css'
        ]))
    );
});



self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => response || fetch(e.request))
    );
});