const concurrently = require('concurrently');
concurrently([
    'cd homework && npm start',
    'cd qianduan && npm start'
],  {

});