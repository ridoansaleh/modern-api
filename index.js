const hapi = require('hapi');
const mongoose = require('mongoose');
const Painting = require('./models/Painting');

mongoose.connect(
    'mongodb://ridoansalehnst:demokrasi1@ds225382.mlab.com:25382/my_powerful_db'
);

mongoose.connection.once('open', () => {
    console.log('connected to database');
});

const server = hapi.server({
    port: 4000,
    host: 'localhost'
});

const init = async () => {
    server.route([
        {
            method: 'GET',
            path: '/',
            handler: function(request, reply) {
                return `<h1>My modern api</h1>`;
            }
        },
        {
            method: 'GET',
            path: '/api/v1/paintings',
            handler: function(request, reply) {
                return Painting.find();
            }
        },
        {
            method: 'POST',
            path: '/api/v1/paintings',
            handler: function(request, reply) {
                const { name, url, techniques } = request.payload;
                const painting = new Painting({
                    name,
                    url,
                    techniques
                });
                return painting.save();
            }
        }
    ]);

    await server.start();
    console.log(`Server running at: ${server.info.uri}`)
};

init();
