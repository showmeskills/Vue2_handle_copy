const { promisifyAll } = require("./6.promise");
const fs = require("fs");
const path = require("path");

let fsPromises = promisifyAll(fs);

Promise.race([fsPromises.readFile('name.txt','utf-8'),fsPromises.readFile('age.txt','utf-8').then(data=>{
    console.log("data",data)
})])