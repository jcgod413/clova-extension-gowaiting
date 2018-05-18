# 고대기 (clova-extension-gowaiting)

## 고대기란?
고대기는 주변 상점의 대기 시스템의 대기 정보를 조회할 수 있고 대기 신청할 수 있는 Extension입니다. 현재 테스트 배포 되있는 상태입니다. 

## 실시간 대기표 정보 확인
http://hack.sullivan.kr/waiting 

## 실행방법
고대기 Extension server는 Node.js로 구현되었습니다. LTS 버전인 Node.js 8.x.x를 먼저 설치해주시길 바랍니다.
https://nodejs.org/ko/download/

### 1. Clone this project
```bash
git clone https://github.com/jcgod413/clova-extension-gowaiting.git

cd clova-extension-gowaiting
```

### 2. Install modules
```bash
npm install
```

### 3. Run the server
```bash
node app
```
- 80번 Port 사용에 문제가 있다면 다른 Port로 변경해주세요. 
```bash
export SERVER_PORT=8080
```

### 4. Send request to Server

#### - GOWAITING URL http://hack.sullivan.kr/clova

#### - TEST_URL : http://localhost:80/clova 

#### - 요청방법 : POST
#### - Body: raw / JSON(application/json)

### Request Example
```json
{
    "version": "0.1.0",
    "session": {
        "sessionId": "e3a898e0-5cfa-4891-9797-ed0a2ab8d3c2",
        "user": {
            "userId": "6bJBCgUMTRK1zEGFel5EIw",
            "accessToken": "0554999e-6230-4ea7-b848-a26aeb9587cc"
        },
        "new": true
    },
    "context": {
        "System": {
            "user": {
                "userId": "6bJBCgUMTRK1zEGFel5EIw",
                "accessToken": "0554999e-6230-4ea7-b848-a26aeb9587cc"
            },
            "device": {
                "deviceId": "1c0a58cf-c56f-4bcf-b27a-907935bee72a",
                "display": {
                    "size": "l100",
                    "orientation": "landscape",
                    "dpi": 96,
                    "contentLayer": {
                        "width": 640,
                        "height": 360
                    }
                }
            }
        }
    },
    "request": {
        "type": "IntentRequest",
        "intent": {
            "name": "PostWaitingIntent",
            "slots": {
                "Store": {
                    "name": "Store",
                    "value": "Starbucks"
                }
            }
        }
    }
}
```

### 5. 발화 Example
- #### 고대기 시작해줘
- #### [고대기에서] 대기 가능 매장 알려줘
- #### [고대기에서] {매장}에서 대기표 뽑아줘
- #### [고대기에서] {매장} 대기상태 알려줘
- #### [고대기에서] 내 차례 언제야? / 내 차례 알려줘

## REST API
- ### GET /waiting
- ### GET /waiting/:id
- ### POST /waiting {body: {phone, store}
- ### DELETE /waiting/:id
- ### PUT /waiting {body: {id, status}}
- ### POST /clova {body: {version, session, context, request }}

## Intent
- ### RetractionIntent
- ### GetOrderIntent
- ### ParamIntent
- ### PostWaitingIntent
- ### GetWaitingIntent
- ### GetStoresIntent

## Slot
- ### StoreListSlot