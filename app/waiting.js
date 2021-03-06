let waitingList = [];
let id = 0;

require('date-utils');

const get = (req, res) => {
    console.log('GET /waiting/:id');

    const {
        id
    } = req.params;

    waitingList.forEach((item, index, array) => {
        if (id == item.id) {
            res.send(waitingList[index]);
        }
    });
    res.send({});
};

const getAll = (req, res) => {
    console.log('GET /waiting');

    res.json(waitingList);
};

const add = (req, res) => {
    console.log('POST /waiting');

    const {
        phone,
        store
    } = req.body;
    var newDate = new Date();
    var time = newDate.toFormat('YYYY-MM-DD HH24:MI:SS');

    waitingList.push({
        id: id++,
        store,
        phone,
        status: 'waiting',
        time
    });

    res.json(waitingList);
};

const modify = (req, res) => {
    console.log('PUT /waiting');

    const {
        id,
        status
    } = req.query;

    waitingList.forEach((item, index, array) => {
        if (id == item.id) {
            waitingList.splice(index, 1, {
                id,
                status
            });
        }
    });

    res.json(waitingList);
};

const remove = (req, res) => {
    console.log('DELETE /waiting');

    const {
        id
    } = req.params;
    waitingList.forEach((item, index, array) => {
        if (id == item.id) {
            waitingList.splice(index, 1);
        }
    });

    res.json(waitingList);
};

const getWaitingCount = (store) => {
    let count = 0;
    waitingList.forEach((item, index, array) => {
        if (store === item.store && item.status === 'waiting') {
            count++;
        }
    });

    return count;
};

const postWaiting = (store, userId) => {
    var newDate = new Date();
    var time = newDate.toFormat('YYYY-MM-DD HH24:MI:SS');
    var duplicated = false;

    waitingList.forEach((item, index, array) => {
        if (item.userId == userId && item.store == store && item.status == 'waiting') {
            duplicated = true;
        }
    });
    if (duplicated === true) {
        return -1;
    }

    waitingList.push({
        id: id++,
        userId,
        store,
        status: 'waiting',
        time
    });
};

const getOrder = (store, userId) => {
    var order = -1,
        count = 0;

    waitingList.forEach((item, index, array) => {
        console.log(item);
        if (item.store === store && item.status === 'waiting') {
            count++;
            if (item.userId === userId) {
                order = count;
            }
        }
    });

    return order;
};

const cancelOrder = (store, userId) => {
    let result = -1;

    waitingList.forEach((item, index, array) => {
        if (item.store == store && item.userId == userId && item.status == 'waiting') {
            item.status = 'canceled';
            result = 0;
        }
    });

    return result;
};

module.exports = {
    get,
    getAll,
    add,
    modify,
    remove,
    getWaitingCount,
    postWaiting,
    getOrder,
    cancelOrder,
};