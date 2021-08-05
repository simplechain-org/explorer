# SimpleChain explorer

site : explorer.simplechain.com

require:

​	nodejs 10

​	mysql

First, start Sipe with `--rpc`

```bash
./sipe --rpc
```

initialize node modules
```
cp config.sample.js config.js
npm install
#or
yarn
```

initialize database
```bash
npm run init
#or
yarn init
```

Create views
```mysql
source views.sql

```

Start explorer
```bash
npm start
```

 Server listening on http://127.0.0.1:3001
