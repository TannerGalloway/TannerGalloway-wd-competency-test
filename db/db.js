var db  = function database(){
    var sqlite3 = require("sqlite3").verbose();

    var db = new sqlite3.Database("./db/newsApp.db");
    
    db.serialize(() => {
    
        db.run("CREATE TABLE IF NOT EXISTS articles(user_id TEXT, title TEXT, category TEXT, content TEXT)" , (err) => {
            if(err){
              console.log(err.message);
            }
          });
    
          db.run("CREATE TABLE IF NOT EXISTS users(username TEXT, password TEXT, role TEXT)" , (err) => {
            if(err){
              console.log(err.message);
            }
          });
    });
    
    db.close();
};

module.exports = {
    db: db
};