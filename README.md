# SimpleChain explorer

site : explorer.simplechain.com

require:

​	nodejs 

​	mysql

First, start Sipe with `--rpc`

```bash
./sipe --rpc
```
Start explorer
```bash
cp config.sample.js config.js
npm install
#or
yarn
npm start
```

 Server listening on http://127.0.0.1:3000