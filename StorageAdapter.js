//Utils used by the Adapter
var Utils = {
    S4:function() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    },
    guid:function(){   
       return (Utils.S4()+Utils.S4()+"-"+Utils.S4()+"-"+Utils.S4()+"-"+Utils.S4()+"-"+Utils.S4()+Utils.S4()+Utils.S4());
    },
}
// just a default callback
var defaultCallback = {
    success : function(data){},
    error : function (data) {
        console.error(data);
    },
}
//Store class
function Store(name){
    this.name = name;
    //Browser || PhoneGap
    this.storage = localStorage || window.localStorage;
    //Load store if already exist
    var store = this.storage.getItem(this.name);
    //parse the stored string. if not exist creates an empty object
    this.data = (store && JSON.parse(store)) || {};
}
/**
*   returns a model by it's Id
*/
Store.prototype.get = function ( model ) {
    return this.data[model.id];
}
/**
*   resturns all objects from the storage
*/
Store.prototype.getAll = function ( ) {
    return this.data;
}
/**
*   stores a model to our local storage
*/
Store.prototype.set = function ( model ) {
    if(!model.id)
        model.id = model.attributes.id = Utils.guid();
    
    this.data[model.id] = model;
    this.save();
    return model;
}
/**
*   stores our dataobject to the localStorage
*/
Store.prototype.save = function ( ) {
    this.storage.setItem(this.name, JSON.stringify(this.data));
}
/**
*   updates a model stored in the storage
*/
Store.prototype.update = function ( model ) {
    this.data[model.id] = model;
    this.save();
    return model;
}
/**
*   deletes an object stored in out data
*/
Store.prototype.delete = function ( model ) {
    delete this.data[model.id];
    this.save();
    return model;
}
    
    
/**
*   Our storage adapter
*   @method
*       method name
*
*   @model
*       the data model
*
*   @storename
*       the name of your store
*
*   @callback
*       is optional. If it's not set the defaultCallback will be called
*/
var StorageAdapter = function (method, model, storename, callback) {
    var resp;
    var store = new Store(storename);
    var callback = callback || defaultCallback;
    
    if(method == "set"){
        resp = store.set(model);
    }else if(method == "get"){
        resp = store.get(model);
    }else if(method == "getAll"){
        resp = store.getAll();   
    }else if(method == "update"){
        resp = store.update(model);
    }else if(method == "delete"){
        resp = store.delete(model);
    }
    
    if(resp){
        callback.success(resp);   
    }else{
        callback.error("entry not found");   
    }
    
    return resp;
}