{
  "name": "RestApi",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "start": "cross-env NODE_ENV=production node ./server.js",
    "dev": "cross-env NODE_ENV=development nodemon ./server.js",
    "lint": "eslint **/*.js",
    "lint:fix": "eslint --fix **/*.js"
  },
  "dependencies": {
    "cors": "2.8.5",
    "cross-env": "7.0.3",
    "dotenv": "^16.0.3",
    "express": "4.17.1",
    "joi": "^17.7.0",
    "mongoose": "^6.7.2",
    "morgan": "1.10.0",
    "nanoid": "^3.0.0"
  },
  "devDependencies": {
    "eslint": "7.19.0",
    "eslint-config-prettier": "^8.3.0",
    "eslint-config-standard": "16.0.3",
    "eslint-plugin-import": "2.25.3",
    "eslint-plugin-json": "2.1.2",
    "eslint-plugin-node": "^11.1.0",
    "eslint-plugin-promise": "5.2.0",
    "nodemon": "2.0.15"
  }
}
