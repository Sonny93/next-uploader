const fastify = require('fastify')();
const fastifyStatic = require('fastify-static');
const path = require('path');

fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'public/static')
});

const start = async () => {
    try {
        await fastify.listen(4000);
        console.log('server files startd as :4000');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
start();