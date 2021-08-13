# Frontend: Login using your wallet

We want to authenticate using our Metamask wallet. To do this we will make the user sign a message which is exchanged with the backend. The backend will on its turn, respond with an authorization token.

## To start

- Install npm modules in backend using `yarn` or `npm install` and run it using `yarn start` or `npm start`
- Create a frontend using `create-react-app` or anything that you deem fit

## Assignment

Show that you can create the authentication flow. We don't want anything fancy looking, just displaying the authentication token retrieved on the end suffices.

## Handing in

Zip folders but exclude the node_modules folder :)


--------------

## How to run
- set up the backend first, the backend should listen at http://localhost:4000
```
$ cd ./backend
$ npm i
$ npm start
```

- then run the frontend, after that you can open http://localhost:3000
```
$ cd ./frontend
$ npm i
$ npm start
```

## auth workflow
![auth workflow image](https://github.com/prince2014/coding-test-frontend-login-sign/blob/main/flow.png?raw=true)

