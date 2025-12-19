const bcryptData = require("bcryptjs");

var bcrypt = {};

const generateHash = async (data) =>{
  try{
    var salt = await bcryptData.genSalt(10);
    var hash = await bcryptData.hash(data.toString(),salt);

    return hash;
  }catch(e){
    throw(e);
  }
}

const compareData = async(userInput,data) =>{
  try{
    var isMatch = bcryptData.compare(userInput,data);

    return isMatch;
  }catch(e){
    throw(e);
  }
}

export { generateHash , compareData }
