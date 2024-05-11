//"환율업데이트정보 Input"
type InputUpdateExchangeInfo = {
  //"소스통화, krw, usd"
  src: string;
  //"타겟통화"
  tgt: string;
  //"환율"
  rate: number;
  //"기준일, 값이 없으면, 최신일자로 등록"
  date?: string;
}

//"환율삭제 Input"
type InputDeleteExchangeInfo = {
  //"소스통화"
  src: string;
  //"타겟통화"
  tgt: string;
  //"기준일"
  date: string;
}

//"환율정보"
type ExchangeInfo = {
  //"소스통화"
  src: string;
  //"타겟통화"
  tgt: string;
  //"환율"
  rate: number;
  //"기준일, 값이 없으면, 최신일자의 환율을 응답"
  date: string;
}

type GetExchangeInfo = {
  src: string;
  tgt: string;
}

export { InputUpdateExchangeInfo, InputDeleteExchangeInfo, GetExchangeInfo, ExchangeInfo };