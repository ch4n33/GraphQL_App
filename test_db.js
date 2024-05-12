try{
    const mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost:27017/GraphQL_App', {});

    const ExchangeSchema = new mongoose.Schema({
        src     : String,
        tgt     : String,
        rate    : Number,
        date    : String
    });
    const Model = mongoose.model('ExchangeInfo', ExchangeSchema);
    Model.findOneAndUpdate({src:'testsrc', tgt: 'testtgt'},{rate:0},{new:true, upsert:true}).then(value=>{
        console.log('Data find test successful', value);
    }).catch(error=>{
        console.log('Data find test unsuccessful');}
    ).finally(()=>{
        console.log('Data find test completed');
        process.exit();
    });
}catch(err){
    console.log('Error in connecting to the database');
    console.log(err);
}finally{
    // process.exit();
}