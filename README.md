
#   설정 및 실행
*   Node.js 모듈 설치
    ```
    $ npm install
    ```
*   빌드 및 실행
    ```
    $ npm run build
    $ npm start
    ```

#   GraphQL App 과제 개발 위키
#   과제 명세 분석
1.  graphql 요청을 받을 것
1.  요청의 종류에 따라 mongoDB에 CRUD 요청을 보낼 것
1.  요청의 종류
    *   Read 요청
        ```
        type Query {
        "환율조회"
        getExchangeRate(src:String!, tgt:String!): ExchangeInfo
        }
        ```
        <details>
        <summary>테스트 쿼리</summary>

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
        
    *   Update 요청
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
        <details>
        <summary>테스트 쿼리</summary>

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

    *   Delete 요청
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
        <details>
        <summary>테스트 쿼리</summary>

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
    *   기타 정보
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

##  프로젝트 파일 생성
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
    *   공식 문서에, 4개의 argument를 콜백으로 전달하고, 그 중 args에, 요청 쿼리 객체가 들어온다고 되어 있음

*   정해진 스키마 형태의 입력을 수행하기 위해 mongoose.model을 사용하기로 함.
    * src, tat, rate, date를 가지는 스키마를 생성하고, 이를 통해 mongoose model을 생성
*   Atomic한 CRUD를 지원하는 메소드 findOne, findOneAndUpdate(upsert: true), findOneAndDelete를 이용
*   server.ts 구현
    *   graphql-yoga, node:http 패키지를 이용해서 http 서버를 만들고, port 5110에서 listen
    *   schema.ts에서 export 한 schema로 graphql-yoga의 createYoga

*   과제 명세 관련 
    *   'src' 와 'tgt'가 같은 문자열일 때의 동작을 추가하기
        *   postexchangerate에서, 해당 경우에 rate는 항상 1.0으로 저장하자
    *   'src' 와 'tgt'가 서로 바뀌어 주어질 때 정상적으로 동작하게 하기
        *   getExchangeRate에서, {src, tgt} or {src:tgt, tgt:src}로 findone한다
        *   해당 경우, src, tgt을 요청과 match한 결과에 따라 rate 또는 1/rate로 응답