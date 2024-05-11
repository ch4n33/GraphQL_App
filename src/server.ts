import { createServer } from 'node:http'
import { createYoga } from 'graphql-yoga'
import { schema } from './schema'

require("dotenv").config();

function main() {
    const yoga = createYoga({ schema });
    const server = createServer(yoga);
    server.listen({ port: process.env.PORT }, () => {
        console.log(`Server is running on http://localhost:${process.env.PORT}/graphql`);
    });
}

main();