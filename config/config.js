/**
 * Created by mattjohnston on 2014-10-30.
 */

var conf = {};
if(process.env.node_env) {
    conf.url = "http://masque.xyz"+ process.env.PORT;
}else{
    conf.url="http://localhost:3000"
}

module.exports = conf;
