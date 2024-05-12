#   GraphQL App 과제 개발 위키
##   과제 명세 분석
1.  graphql 요청을 받을 것
1.  요청의 종류에 따라 mongoDB에 CRUD 요청을 보낼 것
1.  요청의 종류
    <details>
    <summary>Read 요청</summary>

    *   요청 
        ```
        type Query {
        "환율조회"
        getExchangeRate(src:String!, tgt:String!): ExchangeInfo
        }
        ```

    *   쿼리 1
        ```
        #get
        curl -XPOST "http://localhost:5110/graphql" --silent \
        -H  "accept: application/json" \
        -H  "Content-Type: application/json" \
        -d '
        { 
        "query": "query { getExchangeRate (src: \"krw\", tgt: \"usd\") { src tgt rate date } }"
        }
        ' | jq
        #result
        {
        "data": {
            "getExchangeRate": {
            "src": "krw",
            "tgt": "usd",
            "rate": 0.0007450954094671824,
            "date": "2022-11-28"
            }
        }
        }

        ```
    *   쿼리 2
        ```
        #get
        curl -XPOST "http://localhost:5110/graphql" --silent \
        -H  "accept: application/json" \
        -H  "Content-Type: application/json" \
        -d '
        { 
        "query": "query { getExchangeRate (src: \"usd\", tgt: \"krw\") { src tgt rate date } }"
        }
        ' | jq
        #result
        {
        "data": {
            "getExchangeRate": {
            "src": "usd",
            "tgt": "krw",
            "rate": 1342.11,
            "date": "2022-11-28"
            }
        }
        }
        ```
    *   쿼리 3
        ```
        #get
        curl -XPOST "http://localhost:5110/graphql" --silent \
        -H  "accept: application/json" \
        -H  "Content-Type: application/json" \
        -d '
        { 
        "query": "query { getExchangeRate (src: \"usd\", tgt: \"usd\") { src tgt rate date } }"
        }
        ' | jq
        #result
        {
        "data": {
            "getExchangeRate": {
            "src": "usd",
            "tgt": "usd",
            "rate": 1,
            "date": "2022-11-28"
            }
        }
        }
        ```
    *   쿼리 4
        ```
        #get
        curl -XPOST "http://localhost:5110/graphql" --silent \
        -H  "accept: application/json" \
        -H  "Content-Type: application/json" \
        -d '
        { 
        "query": "query { getExchangeRate (src: \"krw\", tgt: \"krw\") { src tgt rate date } }"
        }
        ' | jq
        #result
        {
        "data": {
            "getExchangeRate": {
            "src": "krw",
            "tgt": "krw",
            "rate": 1,
            "date": "2022-11-28"
            }
        }
        }

        ```
    </details>
    
    <details>
    <summary>Update 요청</summary>

    *   요청
        ```
        type Mutation {
        "환율등록, src, tgt, date에 대해서 upsert"
        postExchangeRate(info: InputUpdateExchangeInfo): ExchangeInfo
        "환율삭제, 해당일자의 해당 통화간 환율을 삭제"
        deleteExchangeRate(info: InputDeleteExchangeInfo): ExchangeInfo
        }

        "환율업데이트정보 Input"
        input InputUpdateExchangeInfo {
        "소스통화, krw, usd"
        src: String!
        "타겟통화"
        tgt: String!
        "환율"
        rate: Float!
        "기준일, 값이 없으면, 최신일자로 등록"
        date: String
        }
        ```
    

    *   쿼리 1
        ```
        #update
        curl -XPOST "http://localhost:5110/graphql" --silent \
        -H  "accept: application/json" \
        -H  "Content-Type: application/json" \
        -d '
        { 
        "query": "mutation { postExchangeRate (info: { src: \"usd\", tgt: \"krw\", rate: 1342.11, date:\"2022-11-28\" }) { src tgt rate date } }"
        }
        ' | jq
        #result
        {
        "data": {
            "postExchangeRate": {
            "src": "usd",
            "tgt": "krw",
            "rate": 1342.11,
            "date": "2022-11-28"
            }
        }
        }
        ```
    *   쿼리 2
        ```
        #update
        curl -XPOST "http://localhost:5110/graphql" --silent \
        -H  "accept: application/json" \
        -H  "Content-Type: application/json" \
        -d '
        { 
        "query": "mutation { postExchangeRate (info: { src: \"krw\", tgt: \"krw\", rate: 2.0, date:\"2022-11-28\" }) { src tgt rate date } }"
        }
        ' | jq

        #result
        {
        "data": {
            "postExchangeRate": {
            "src": "krw",
            "tgt": "krw",
            "rate": 1,
            "date": "2022-11-28"
            }
        }
        }
        ```
    </details>

    <details>
    <summary>Delete 요청</summary>

    *   요청
        ```
        "환율삭제 Input"
        input InputDeleteExchangeInfo {
        "소스통화"
        src: String!
        "타겟통화"
        tgt: String!
        "기준일"
        date: String!
        }
        ```
    

    *   쿼리 1
        ```
        #delete
        curl -XPOST "http://localhost:5110/graphql" --silent \
        -H  "accept: application/json" \
        -H  "Content-Type: application/json" \
        -d '
        { 
        "query": "mutation { deleteExchangeRate (info: { src: \"usd\", tgt: \"krw\", date:\"2022-11-28\" }) { src tgt rate date } }"
        }
        ' | jq
        #result
        {
        "data": {
            "deleteExchangeRate": {
            "src": "usd",
            "tgt": "krw",
            "rate": 1342.11,
            "date": "2022-11-28"
            }
        }
        }
        ```
    *   쿼리 2
        ```
        #delete
        curl -XPOST "http://localhost:5110/graphql" --silent \
        -H  "accept: application/json" \
        -H  "Content-Type: application/json" \
        -d '
        { 
        "query": "mutation { deleteExchangeRate (info: { src: \"krw\", tgt: \"krw\", date:\"2022-11-28\" }) { src tgt rate date } }"
        }
        ' | jq
        #result
        {
        "data": {
            "deleteExchangeRate": {
            "src": "krw",
            "tgt": "krw",
            "rate": 1,
            "date": "2022-11-28"
            }
        }
        }
        ```
    </details>

    <details>
    <summary>기타 정보</summary>
    *   환율을 저장할 정보
        ```
        "환율정보"
        type ExchangeInfo @key(fields: "src, tgt") {
        "소스통화"
        src: String!
        "타겟통화"
        tgt: String!
        "환율"
        rate: Float!
        "기준일, 값이 없으면, 최신일자의 환율을 응답"
        date: String!
        }
        ```
    </details>
##  최초 환경 설정

*   개발 환경 설정
    1.  개발 환경 확인
        *   Windows 11 Education 23H2
        *   MongoDB 7.0.9
        *   node.js v20.12.2
        *   ├── @types/express@4.17.21
            ├── @types/node@20.12.11
            ├── graphql-yoga@5.3.1
            └── typescript@5.4.5
    1.  node 환경
        ```
        $ node
        Welcome to Node.js v20.12.2.
        Type ".help" for more information.
        >
        ```
    1.  express로 개발된 라이브러리 graphql-yoga 설치
        ```
        $ npm i graphql-yoga

        added 28 packages in 8s
        ```
    1.  typescript 설치
        ```
        $ npm i -D typescript @types/express @types/node

        added 13 packages, and audited 42 packages in 4s

        found 0 vulnerabilities
        ```
    1.  mongodb 설치
        *   https://www.mongodb.com/try/download/community
        *   community 버전 설치
        *   설치 완료 후 디렉토리 내의 mongod.exe 실행 후 localhost:27017 정상 응답 확인
    1.  기타 필요한 패키지는 그때그때 설치

##  구현 
*   require('graphql-yoga')를 인식하지 못하는 문제
    1.  npm tsc --init
    1.  package.json에 compile 관련 설정 추가

*   compile된 js 파일이 dest 디렉토리가 아니라, src 디렉토리에 생기는 현상
    1.  tsconfig.json에 "outDir": "./dist/"를 추가

*   schema 등록을 위해 graphql-yoga의 createSchema 함수를 이용하기로 함
    1.  사용법 : resolver, typedefs string을 통해 schema를 schema.ts에 만들고, 이것을 export해 server.ts에서 사용
        *   데이터 전달 타입인 InputUpdateExchangeInfo, InputDeleteExchangeInfo, ExchangeInfo을 types.ts에 정의 후 사용
        *   resolver에 등록할 요청 처리 함수 getExchangeRate, postExchangeRate, deleteExchangeRate를 db.ts에 정의 후 사용

*   graphql로 들어온 요청을 resolver에서 어떻게 처리할지 모르겠음
    *   ```(info)=>{database(info); return {src:info.src, ..., date:'test_date'}}``` 형식으로 테스트했는데, null을 return 할 수 없다는 오류가 발생
    1.  resolver에 요청에 해당하는 이름의 요청 처리 함수를 등록해야 하는데, 함수를 어떤 식으로 작성해야 하는지, 비동기 처리는 어떻게 지원되는지 등을 모르겠음.
    1.  graphql-yoga 공식 문서 참고
        *   함수에는 4개의 parameter로 주어지고, 그 중 요청은 schema에 정의한 대로 args parameter로 주어진다.
        *   resolver는 async 함수여도 괜찮음(괜찮은 건지 async여야 하는 건지는 모르겠음)
    *   위에서 발생한 오류는 args parameter가 아닌, 다른 parameter를 참조해서 발생한 문제였음

*   schema를 graphql-yoga가 제대로 인식하지 못하는 문제
    1.  @key 키워드를 인식하지 못하는 것으로 보여, 이를 schema에서 삭제
    1.  성능 상 문제가 있을 가능성이 있을지도 모르겠지만, graphql-yoga에서 기본적으로는 지원하지 않아, 이것을 고치려면 Apollo 등 다른 패키지를 사용해야 할 가능성이 있으므로 삭제
    *   공식 문서에, 4개의 argument를 콜백으로 전달하고, 그 중 args에, 요청 쿼리 객체가 들어온다고 되어 있음

*   정해진 스키마 형태의 입력을 수행하기 위해 mongoose.model을 사용하기로 함.
    * src, tat, rate, date를 가지는 스키마를 생성하고, 이를 통해 mongoose model을 생성
*   Atomic한 CRUD를 지원하는 메소드 findOne, findOneAndUpdate(upsert: true), findOneAndDelete를 이용

*   server.ts 구현
    *   graphql-yoga, node:http 패키지를 이용해서 http 서버를 만들고, port 5110에서 listen
    *   schema.ts에서 export 한 schema로 graphql-yoga의 createYoga

##  과제 명세 관련 
*   'src' 와 'tgt'가 같은 문자열일 때의 동작
    *   postexchangerate에서, 해당 경우에 rate는 항상 1.0으로 저장하자
    *   getExchangeRate로 요청하는 경우 어떻게 응답할지 확실하게 과제 명세에서 제공되어 있지 않다.
        1.  어떤 값이 getExchangeRate로 요청이 들어오든지 rate:1로 응답
        1.  <del>해당 src를 가지고 있는 document가 존재할 경우 rate:1로 응답 </del>
*   'src' 와 'tgt'가 서로 바뀌어 주어질 때의 동작
    *   getExchangeRate에서, {src, tgt} or {src:tgt, tgt:src}로 findone한다
    *   해당 경우, src, tgt을 요청과 match한 결과에 따라 rate 또는 1/rate로 응답

    