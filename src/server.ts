import { createServer } from 'node:http'
import { createYoga } from 'graphql-yoga'
import { schema } from './schema'


function main() {
    const yoga = createYoga({ schema });
    const server = createServer(yoga);
    server.listen({ port: 5110 }, () => {
        console.log(`Server is running on http://localhost:5110/graphql`);
    });
}

main();