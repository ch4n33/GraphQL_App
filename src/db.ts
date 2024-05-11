import { InputUpdateExchangeInfo, InputDeleteExchangeInfo, GetExchangeInfo, ExchangeInfo } from './types'
import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/GraphQL_App', {});

const ExchangeSchema = new mongoose.Schema({
    src     : String,
    tgt     : String,
    rate    : Number,
    date    : String
});

const Model = mongoose.model('ExchangeInfo', ExchangeSchema);


async function getExchangeRate(obj: any, args: GetExchangeInfo, context: any, info: any): Promise<ExchangeInfo> {
    console.log('getExchangeRate', args);
    const data = await Model.findOne(
        { src: args.src, tgt: args.tgt},
        {},
        {sort : {date: -1}}
    );
    console.log('getExchangeRate, data:', data);
    let rate:number;
    if (data?.rate === null || data?.rate === undefined) {
        rate = 0;
    }
    else{
        rate = data?.rate;
    }
    return {src: ''+data?.src, tgt: ''+data?.tgt, rate: rate, date: ''+data?.date};
}


async function postExchangeRate(obj: any, args: {info: InputUpdateExchangeInfo}, context: any, info: any): Promise<ExchangeInfo> {
    console.log('postExchangeRate, query:', args);
    let data;
    if (!args.info.date) { // args.date is null or undefined or mf
        data = await Model.findOneAndUpdate(
        
            { src: args.info.src, tgt: args.info.tgt}, 
            { src: args.info.src, tgt: args.info.tgt, rate: args.info.rate} ,   //가장 최근의 환율을 업데이트
            { new: true, upsert: true, sort: {date: -1}}
        );
    }
    else{//args.date is not null
        console.log('else args:', args.info.src, args.info.tgt, args.info.date, args.info.rate)
        data = await Model.findOneAndUpdate(
            { src: args.info.src, tgt: args.info.tgt, date: args.info.date}, 
            { src: args.info.src, tgt: args.info.tgt, date: args.info.date, rate: args.info.rate},
            { new: true, upsert: true }
        );
    }
    console.log('postExchangeRate, data:', data);
    let rate:number;
    if (data.rate === null || data.rate === undefined) {
        rate = 0;
    }
    else{
        rate = data.rate;
    }
    return {src: ''+data.src, tgt: ''+data.tgt, rate: rate, date: ''+data.date};
}


async function deleteExchangeRate(obj: any, args: {info: InputDeleteExchangeInfo}, context: any, info: any): Promise<ExchangeInfo> {
    console.log('deleteExchangeRate, info:', args);
    const data = await Model.findOneAndDelete(
        {src: args.info.src, tgt: args.info.tgt, date: args.info.date},
        { new: true }
    );
    let rate:number;
    if (data?.rate === null || data?.rate === undefined) {
        rate = 0;
    }
    else{
        rate = data?.rate;
    }
    return {src: ''+data?.src, tgt: ''+data?.tgt, rate: rate, date: ''+data?.date};
}

export { getExchangeRate, postExchangeRate, deleteExchangeRate };