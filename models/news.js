const orm = require("../config/orm.js");

// create an object that has access to the orm functions. The returned data from the orm is passesed throgh the modal and back to the function that called the query.
var news = {
    all: function(table, cb)
    {
        orm.selectAll(table, function(res)
        {
            cb(res)
        });
    },

    conditionSearch: function(col, table, value, cb)
    {
        orm.selectWhere(col, table, value, function(res)
        {
            cb(res)
        });
    },

    search2conditions: function(col, col2, table, value, value2, cb)
    {
        orm.selectWhere2(col, col2, table, value, value2, function(res)
        {
            cb(res)
        });
    },

    usersselect: function(col, table, value, value2, cb)
    {
        orm.selectWhereUsers(col, table, value, value2, function(res)
        {
            cb(res)
        });
    },

    limitConditionSearch: function(col, col1, col2, table, value, limit, cb)
    {
        orm.selectWhereLimit(col, col1, col2, table, value, limit,  function(res)
        {
            cb(res)
        });
    },

    group: function(col, col2, table, cb)
    {
        orm.selectGroup(col, col2, table, function(res)
        {
            cb(res)
        });
    },

    insert: function(table, values, cb)
    {
        orm.insertValues(table, values, function(res)
        {
            cb(res)
        });
    },

    update: function(table, col1, col2, col3, value1, value2, value3, condition, condition2, conditionValue, conditionValue2, cb)
    {
        orm.updateValues(table, col1, col2, col3, value1, value2, value3, condition, condition2, conditionValue, conditionValue2, function(res)
        {
            cb(res)
        });
    },

    updateUsers: function(table, col, value, condition, conditionValue, cb)
    {
        orm.updateOne(table, col, value, condition, conditionValue, function(res)
        {
            cb(res)
        });
    },

    delete: function(table, condition, conditionValue, cb)
    {
        orm.deleteOne(table, condition, conditionValue, function(res)
        {
            cb(res)
        });
    },

    deleteMany: function(table, condition, condition2, conditionValue, conditionValue2, cb) {
        orm.deleteValues(table, condition, condition2, conditionValue, conditionValue2, function(res) {
          cb(res);
        });
      }
}

module.exports = news;