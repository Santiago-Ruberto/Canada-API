const listenerAPP = require('./app');
listenerAPP.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});