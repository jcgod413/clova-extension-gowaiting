const uuid = require('uuid').v4;
const _ = require('lodash');
const waiting = require('./waiting');

class Directive {
    constructor({
        namespace,
        name,
        payload,
    }) {
        this.header = {
            messageId: uuid(),
            namespace,
            name,
        }
        this.payload = payload;
    }
}

const manageWaiting = (store, action) => {
    let waitingCount = waiting.getWaitingCount(slots.Store.value);
    let responseText = "";

    if (waitingCount == -1) {
        responseText += "지원하지 않는 상점입니다.";
    } else {
        switch (action) {
            case "GetWaiting":
                responseText = "대기인원은 " + waitingCount + "명 입니다.";
                break;
            case "PostWaiting":
                responseText = "대기 신청이 완료되었습니다. 총 대기인원은 " + waitingCount + "명 입니다.";
                break;
        }
    }
    return responseText;
}

class CEKRequest {
    constructor(httpReq) {
        this.request = httpReq.body.request;
        this.context = httpReq.body.context;
        this.session = httpReq.body.session;
        console.log(`CEK Request: ${JSON.stringify(this.context)}, ${JSON.stringify(this.session)}`)
    }

    do(cekResponse) {
        switch (this.request.type) {
            case 'LaunchRequest':
                return this.launchRequest(cekResponse);
            case 'IntentRequest':
                return this.intentRequest(cekResponse);
            case 'SessionEndedRequest':
                return this.sessionEndedRequest(cekResponse);
        }
    }

    launchRequest(cekResponse) {
        console.log('launchRequest')
        cekResponse.setSimpleSpeechText("고대기에서 매장 대기상태 알려줘 또는 매장 대기표 뽑아줘 라고 시도해보세요.");
        cekResponse.setMultiturn({
            intent: 'ManageWaitingIntent',
        });
    }

    intentRequest(cekResponse) {
        console.log('intentRequest');
        const intent = this.request.intent.name;
        const slots = this.request.intent.slots;

        switch (intent) {
            case 'ManageWaitingIntent':
                let responseText = manageWaiting(slots.Store.value, slots.Action.value);
                cekResponse.setSimpleSpeechText(responseText);
                break;
            case 'Clova.GuideIntent':
            default:
                cekResponse.setSimpleSpeechText("고대기에서 매장 대기상태 알려줘 또는 매장 대기표 뽑아줘 라고 시도해보세요.");
        }

        if (this.session.new == false) {
            cekResponse.setMultiturn()
        }
    }

    sessionEndedRequest(cekResponse) {
        console.log('sessionEndedRequest')
        cekResponse.setSimpleSpeechText('고대기를 종료합니다.')
        cekResponse.clearMultiturn()
    }
}

class CEKResponse {
    constructor() {
        this.response = {
            directives: [],
            shouldEndSession: true,
            outputSpeech: {},
            card: {},
        }
        this.version = '0.1.0';
        this.sessionAttributes = {};
    }

    setMultiturn(sessionAttributes) {
        this.response.shouldEndSession = false;
        this.sessionAttributes = _.assign(this.sessionAttributes, sessionAttributes);
    }

    clearMultiturn() {
        this.response.shouldEndSession = true;
        this.sessionAttributes = {};
    }

    setSimpleSpeechText(outputText) {
        this.response.outputSpeech = {
            type: 'SimpleSpeech',
            values: {
                type: 'PlainText',
                lang: 'ko',
                value: outputText,
            },
        }
    }

    appendSpeechText(outputText) {
        const outputSpeech = this.response.outputSpeech;
        if (outputSpeech.type != 'SpeechList') {
            outputSpeech.type = 'SpeechList';
            outputSpeech.values = []
        }
        if (typeof (outputText) == 'string') {
            outputSpeech.values.push({
                type: 'PlainText',
                lang: 'ko',
                value: outputText,
            });
        } else {
            outputSpeech.values.push(outputText);
        }
    }
}

const clovaReq = (httpReq, httpRes, next) => {
    cekResponse = new CEKResponse();
    cekRequest = new CEKRequest(httpReq);
    cekRequest.do(cekResponse);
    console.log(`CEKResponse: ${JSON.stringify(cekResponse)}`)
    return httpRes.send(cekResponse)
}

module.exports = clovaReq;