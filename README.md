
#   설정 및 실행
1.  Node.js 모듈 설치합니다
    ```
    $ npm install
    ```
1.  localhost:27017에서 MongoDB를 켭니다
    *   mongodb 연결을 테스트합니다
        ```
        $ npm run test_db
        ```
    *   결과가 unsuccessful할 시 MongoDB가 켜져 있는지, 27017 port에서 listen중인지 등 데이터베이스의 상태를 확인합니다.
1.  빌드 및 실행
    ```
    $ npm run build
    $ npm start
    ```