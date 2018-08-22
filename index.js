const hapi = require('hapi');
const mongoose = require('mongoose');
const { graphqlHapi, graphiqlHapi } = require('apollo-server-hapi');
const Painting = require('./models/Painting');
const schema = require('./graphql/schema');

mongoose.connect(
    'mongodb://ridoansalehnst:demokrasi1@ds225382.mlab.com:25382/my_powerful_db',
    { useNewUrlParser: true }
);

mongoose.connection.once('open', () => {
    console.log('connected to database');
});

const server = hapi.server({
    port: 4000,
    host: 'localhost'
});

const init = async () => {
    await server.register({
        plugin: graphiqlHapi,
        options: {
            path: '/graphiql',
            graphiqlOptions: {
                endpointURL: '/graphql'
            },
            route: {
                cors: true
            }
        }
    });

    await server.register({
        plugin: graphqlHapi,
        options: {
            path: '/graphql',
            graphqlOptions: {
                schema
            },
            route: {
                cors: true
            }
        }
    });

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

    try {
        await server.start()
        console.log(`Server running at: ${server.info.uri}`)
    } catch (err) {
        console.log(`Error while starting server: ${err.message}`)
    }
};

init();
