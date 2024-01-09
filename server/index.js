const express = require('express');
const {ApolloServer} = require('@apollo/server');
const {expressMiddleware} = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const { default : axios } = require('axios');

async function startServer(){
    const app = express();
    const server = new ApolloServer({
        typeDefs : `
            type User {
                id: ID!
                name: String!
                username: String!
                email: String
                phone : String
            }
            type Todo {
                id : ID!
                userId : ID!
                title : String!
                completed : Boolean!
                user : User
            }
            type Query {
                getTodos : [Todo]
                getAllUsers : [User]
                getUser(id : ID!) : User
            }
        `,
        resolvers: {
            Todo : {
                user : async (todo) => (await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.userId}`)).data

            },
            Query :{
                getTodos : async () => 
                (await axios.get('https://jsonplaceholder.typicode.com/todos/')).data,
                getAllUsers : async () => 
                (await axios.get('https://jsonplaceholder.typicode.com/users')).data,
                getUser : async (parent, {id}) => 
                (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data,
            }
        } ,
    })

    app.use(bodyParser.json());
    app.use(cors());

    await server.start()
    // Add the GraphQL middleware to our Express application with the path /graphql
    app.use("/graphql", expressMiddleware(server))
    app.listen(19967,() => {
        console.log("🚀 Server ready at http://localhost:19967")
    })
}

startServer()