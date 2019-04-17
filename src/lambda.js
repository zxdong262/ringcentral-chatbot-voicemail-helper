import serverlessHTTP from 'serverless-http'
// import { createAsyncProxy } from 'ringcentral-chatbot/dist/lambda'
import app from './app'
// import express from 'express'

exports.app = serverlessHTTP(app)

// const filterApp = express()

// exports.proxy = createAsyncProxy('app', filterApp)
