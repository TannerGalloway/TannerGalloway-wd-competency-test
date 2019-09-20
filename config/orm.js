const connection = require("./connection.js");

// creates an obejct with database query functions.

// first constructs a query then sends the query to the database once returned send the data to the function that called the database call. 
var orm = { 
    selectAll: function(table, cb)
    {   var querystring = "SELECT * FROM " + table + ";"; 
        connection.query(querystring, function(err, data)
        {
            if(err) 
            {
                throw err;
            }
        
            cb(data);
        });
    },

    selectWhere: function(col, table, value, cb)
    {   var querystring = "SELECT * FROM " + table + " WHERE " + col + " = " + value + ";"; 
        connection.query(querystring, function(err, data)
        {
            if(err) 
            {
                throw err;
            }
        
            cb(data);
        });
    },

    selectWhere2: function(col, col2, table, value, value2, cb)
    {   var querystring = "SELECT * FROM " + table + " WHERE " + col + " = " + value + " AND " + col2 + " = " + value2 + ";"; 
        connection.query(querystring, function(err, data)
        {
            if(err) 
            {
                throw err;
            }
        
            cb(data);
        });
    },

    selectWhereLimit: function(col, col1, col2, table, value, limit, cb)
    {   var querystring = "SELECT " + col1 + ", " + col2 + " FROM " + table + " WHERE " + col + " = " + value + " LIMIT " + limit + ";" 
        connection.query(querystring, function(err, data)
        {
            if(err) 
            {
                throw err;
            }
        
            cb(data);
        });
    },

    selectGroup: function(col, col2, table, cb)
    {   var querystring = "SELECT " + col + " FROM " + table + " GROUP BY " + col2 + ";"; 
        connection.query(querystring, function(err, data)
        {
            if(err) 
            {
                throw err;
            }
        
            cb(data);
        });
    },
    
    
    insertValues: function(table, values, cb)
    {
        var querystring = "INSERT INTO " + table + " VALUES (" + values + ");"
        connection.query(querystring, function(err, data)
        {
            if(err)
            {
                throw err;
            }

            cb(data);
        });
    },

    updateValues: function(table, col1, col2, col3, value1, value2, value3, condition, condition2, conditionValue, conditionValue2, cb)
    {
        var querystring = "UPDATE " + table + " SET " + col1 + " = " + value1 + ", " + col2 + " = " + value2 + ", " + col3 + " = " + value3 + 
        " WHERE " + condition + " = " + conditionValue + " AND " + condition2 + " = " + conditionValue2 + ";";
        connection.query(querystring, function(err, data)
        {
            if(err)
            {
                throw err;
            }
            cb(data)
        });
    },

    deleteValues: function(table, condition, condition2, conditionValue, conditionValue2, cb) {
        var queryString = "DELETE FROM " + table + " WHERE " + condition + " = " + conditionValue + " AND " + condition2 + " = " + conditionValue2 + ";";
        connection.query(queryString, function(err, result) {
          if (err) {
            throw err;
          }
    
          cb(result);
        });
      }
}

module.exports = orm;