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

          db.run("INSERT INTO articles VALUES('John', 'The world we dont know', 'Science', 'The small world of atoms is still undiscovered.')", (err) => {
              if(err){
                  console.log(err. message);
              }
          });

          
          db.run("INSERT INTO articles VALUES('Sam', 'Walking dead season 10 Premiere date revealed', 'Entertainment', 'The  Premiere date for the walking dead season 10 has been revealed.')", (err) => {
            if(err){
                console.log(err. message);
            }
        });

        
        db.run("INSERT INTO articles VALUES('Blake', 'Bilboard music top new artists', 'Music', 'Bilboard music top new artists shine at the award show.')", (err) => {
            if(err){
                console.log(err. message);
            }
        });
    });
    
    db.close();
};

module.exports = {
    db: db
};