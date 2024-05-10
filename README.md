# GraphQL App 과제 개발 위키

# 과제 명세 분석
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
##  처음으로 할 수 있는 일

*   개발 환경 설정
    1.  개발 환경 확인
    1.  node 설치 확인
    1.  npm으로 graphql을 동작하는 라이브러리 설치
    1.  ts 설치
    1.  mongodb 설치
###   결과

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