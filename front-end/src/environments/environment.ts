export const environment = {
    production: true,
    apiUrl: window.location.hostname === '192.168.0.44'
        ? 'http://192.168.0.44:3000/api'
        : 'http://nobrevida.sytes.net:3000/api'
};
