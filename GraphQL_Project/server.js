const express = require('express')
const expressGraphQL = require('express-graphql').graphqlHTTP
const mongoose = require('mongoose')

//var ObjectID = require('mongodb').ObjectID;
var rentersdb = require("./models/renter");
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
            },
        rented: { type: GraphQLNonNull(GraphQLBoolean) },
        renterId: { type: GraphQLNonNull(GraphQLString) },
        renter: {
            type: RenterType,
            resolve: (book) => {               
                return renterId.findOne({_id: book.renterId}) } 
            }
        }      
    })
})

const RenterType = new GraphQLObjectType({
    name: 'Renter',
    description: 'This is a renter of books',
    fields: () => ({
        _id: { type: GraphQLNonNull(GraphQLString) },
        firstname: { type: GraphQLNonNull(GraphQLString) },
        lastname: { type: GraphQLNonNull(GraphQLString) },              
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
        /*
        book: {
            type: BookType,
            description: 'A Single Book',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => books.find(book => book.id === args.id)
        },
        */
        renter: {
            type: AuthorType,
            description: 'A Single Renter by ID',
            args: {
                id: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) => {
                return rentersdb.findOne({_id: args.id})
            }
        },

        renters: {
            type: new GraphQLList(AuthorType),
            description: 'List of all Renters',
            resolve: () => {
                return rentersdb.find()
            }
        }, 
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
                authorId: { type: GraphQLNonNull(GraphQLString) },
                renterId: { type: GraphQLNonNull(GraphQLString) },                
            },
            resolve: (parent, args) => {                
                const book = {
                    title: args.title,
                    authorId: args.authorId,
                    rented: false,
                    renterId: args.renterId                                      
                }
                booksdb.create(book)
                return book
            }
        },
        addRenter: {
            type: RenterType,
            description: 'Add a Renter',
            args: {                
                firstname: { type: GraphQLNonNull(GraphQLString) },
                lastname: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) => {                
                const renter = {
                    firstname: args.firstname,
                    lastname: args.lastname                    
                }
                rentersdb.create(renter)
                return renter
            }
        },
        deleteBook: {
            type: BookType,
            description: 'Delete a book',
            args: {                
                id: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: async (parent, args) =>  {                
                return booksdb.findByIdAndDelete(args.id)
            }
        }
        ,
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
        ,
        deleteRetner: {
            type: RenterType,
            description: 'Delete an Renter',
            args: {                
                id: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: async (parent, args) =>  {                
                return rentersdb.findByIdAndDelete(args.id)
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


