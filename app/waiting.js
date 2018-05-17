let waitingList = [];
let id = 0;

require('date-utils');

const get = (req, res) => {
    console.log('GET /waiting/:id');
    
    const { id } = req.params;
    waitingList.forEach((item, index, array) => {
        if( id == item.id )    {
            res.send(waitingList[index]);
        }
    });
    res.send({});
};

const getAll = (req, res) => {
    console.log('GET /waiting');
    
    res.send(waitingList);
};

const add = (req, res) => {
    console.log('POST /waiting');
    
    const { phone, store } = req.body;
    var newDate = new Date();
    var time = newDate.toFormat('YYYY-MM-DD HH24:MI:SS');
    
    waitingList.push({id: id++, store, phone, status: 'waiting', time});

    res.send(waitingList);
};

const modify = (req, res) => {
    console.log('PUT /waiting');

    const { id, status } = req.query;

    console.log(id, status);
    waitingList.forEach((item, index, array) => {
        if( id == item.id )    {
            waitingList.splice(index, 1, {id, status});
        }
    });

    res.send(waitingList);
};

const remove = (req, res) => {
    console.log('DELETE /waiting');

    const { id } = req.params;
    waitingList.forEach((item, index, array) => {
        if( id == item.id )    {
            waitingList.splice(index, 1);
        }
    });

    res.send(waitingList);
};

const getWaitingCount = (store) => {
    let count = 0;
   console.log('getWaitingCount: ', store); 
    waitingList.forEach((item, index, array) => {
	console.log(item);
        if( store === item.store && item.status === 'waiting' )    {
            count++;
        }
    });

    return count;
};

module.exports = {
    get,  
    getAll,
    add,
    modify,
    remove,
    getWaitingCount,
};
