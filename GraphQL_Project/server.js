const express = require('express')
const expressGraphQL = require('express-graphql').graphqlHTTP
const mongoose = require('mongoose')

//var ObjectID = require('mongodb').ObjectID;

var authorsdb = require("./models/author");
var booksdb = require("./models/book");

require("./models/db");
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLBoolean
} = require('graphql')

const app = express()

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'This is a book',
    fields: () => ({
        _id: { type: GraphQLNonNull(GraphQLString) },
        title: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLString) }, 
        rented: {type: GraphQLNonNull(GraphQLBoolean) },      
        author: {
            type: AuthorType,
            resolve: (book) => {               
                return authorsdb.findOne({_id: book.authorId})           
            }
        }        
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'This is an author',
    fields: () => ({        
        firstname: { type: GraphQLNonNull(GraphQLString) },
        lastname: { type: GraphQLNonNull(GraphQLString) },
        _id: { type: GraphQLNonNull(GraphQLString) },        
        books: {
            type: new GraphQLList(BookType),
            resolve: (author) => {
                return booksdb.find({authorId: author._id})
            }
        }           
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        books: {
            type: new GraphQLList(BookType),
            description: 'List of Books',
            resolve: () => {
                return booksdb.find()
            }
        }, 
        book: {
            type: BookType,
            description: 'A single book',
            args: {
                id: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) => {
                return booksdb.findOne({_id: args.id})
            }
        },             
        authors: {
            type: new GraphQLList(AuthorType),
            description: 'List of all Authors',
            resolve: () => {
                return authorsdb.find()
            }
        },        
        author: {
            type: AuthorType,
            description: 'A Single Author',
            args: {
                id: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) => {
                return authorsdb.findOne({_id: args.id})
            }
        }        
    })
})

 

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        /*
        addBook: {
            type: BookType,
            description: 'Add a Book',
            args: {
                name: { type: GraphQLNonNull(GraphQLString)},
                authorId: { type: GraphQLNonNull(GraphQLInt)}
            },
            resolve: (parent, args) => {
                const book = {
                    id: books.length + 1,
                    name: args.name,
                    authorId: args.authorId
                }
                books.push(book)
                return book
            }
        },
        */
        addAuthor: {
            type: AuthorType,
            description: 'Add an Author',
            args: {                
                firstname: { type: GraphQLNonNull(GraphQLString) },
                lastname: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) => {
                const author = {
                    firstname: args.firstname,
                    lastname: args.lastname                    
                }
                authorsdb.create(author)
                return author
            }
        },
        addBook: {
            type: BookType,
            description: 'Add an Author',
            args: {                
                title: { type: GraphQLNonNull(GraphQLString) },
                authorId: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) => {                
                const book = {
                    title: args.title,
                    authorId: args.authorId,
                    rented: false                    
                }
                booksdb.create(book)
                return book
            }
        },
        deleteAuthor: {
            type: AuthorType,
            description: 'Delete an Author',
            args: {                
                id: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: async (parent, args) =>  {                
                return authorsdb.findByIdAndDelete(args.id)
            }
        }
    })
})


const schema = new GraphQLSchema({
    query: RootQueryType,    
    mutation: RootMutationType
})


app.use('/graphql', expressGraphQL({
    schema: schema, 
    graphiql: true
}))

app.listen(5000., () => console.log('Server Running'))


