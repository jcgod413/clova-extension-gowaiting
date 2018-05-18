const uuid = require('uuid').v4;
const _ = require('lodash');
const waiting = require('./waiting');
const {
    RT_GETWAITING_1,
    RT_GETWAITING_2,
    RT_POSTWAITING_1,
    RT_POSTWAITING_2,
    RT_GETSTORES_1,
    RT_GETSTORES_2,
    RT_GETORDER_1,
    RT_GETORDER_2,
    RT_GETORDER_3,
    RT_NOWAITING,
    RT_NO_STORE,
    RT_DUPLICATED,
    RT_START,
    RT_GUIDE,
    RT_END,
    STORES,
} = require('../config');

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

const getWaiting = (store) => {
    let responseText = "";
    let waitingCount = waiting.getWaitingCount(store);
    if (waitingCount == -1) {
        responseText += RESPONSE_NO_STORE;
    } else {
        responseText = RT_GETWAITING_1 + waitingCount + RT_GETWAITING_2;
    }

    return responseText;
}

const postWaiting = (store, userId) => {
    let responseText = "";

    let result = waiting.postWaiting(store, userId);
    console.log(result);
    if (result === -1) {
        // found duplicated request
        return RT_DUPLICATED;
    }

    let waitingCount = waiting.getWaitingCount(store);
    responseText = RT_POSTWAITING_1 + waitingCount + RT_POSTWAITING_2;

    return responseText;
}

const getStores = () => {
    let responseText = RT_GETSTORES_1;
    STORES.forEach((item, index, array) => {
        responseText += item + ", ";
    });
    responseText += RT_GETSTORES_2;
    return responseText;
}

const getOrder = (store, userId) => {
    let order = waiting.getOrder;
    let waitingCount = waiting.getWaitingCount(store);
    let responseText;

    if (order === -1) {
        responseText = RT_NOWAITING;
    } else {
        responseText = RT_GETORDER_1 + order + RT_GETORDER_2 + waitingCount + RT_GETORDER_3;
    }

    return responseText;
}

const getParam = (sessionAttributes, slots, userId) => {
    if (!sessionAttributes || !sessionAttributes.intent) {
        return RT_GUIDE;
    }

    const store = slots.Store.value;
    console.log('getParam', store, userId);

    switch (sessionAttributes.intent) {
        case 'GetWaitingIntent':
            return getWaiting(store);
        case 'PostWaitingIntent':
            return postWaiting(store, userId);
        case 'GetOrderIntent':
            return getOrder(store, userId);
    }
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
        console.log('launchRequest');
        cekResponse.setSimpleSpeechText(RT_START + RT_GUIDE);
        cekResponse.setMultiturn();
    }

    intentRequest(cekResponse) {
        console.log('intentRequest');
        const intent = this.request.intent.name;
        const slots = this.request.intent.slots;
        const sessionAttributes = this.session.sessionAttributes;
        const userId = this.context.System.device.deviceId;
        let store;
        console.log(userId);
        if (intent !== 'GetStoresIntent' && (!slots || !slots.Store)) {
            cekResponse.setMultiturn({
                intent,
            });
            cekResponse.setSimpleSpeechText(RT_NO_STORE);
            return;
        }

        let responseText;
        switch (intent) {
            case 'GetWaitingIntent':
                store = slots.Store.value;
                responseText = getWaiting(store);
                break;
            case 'PostWaitingIntent':
                store = slots.Store.value;
                responseText = postWaiting(store, userId);
                break;
            case 'GetStoresIntent':
                responseText = getStores();
                break;
            case 'GetOrderIntent':
                // GetOrderIntent always activate by ParamIntent
                break;
            case 'ParamIntent':
                responseText = getParam(sessionAttributes, slots, userId);
                break;
            case 'Clova.GuideIntent':
            default:
                responseText = RT_GUIDE;
        }
        cekResponse.setSimpleSpeechText(responseText);

        if (this.session.new == false) {
            cekResponse.setMultiturn();
        }
    }

    sessionEndedRequest(cekResponse) {
        console.log('sessionEndedRequest');
        cekResponse.setSimpleSpeechText(RT_END);
        cekResponse.clearMultiturn();
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