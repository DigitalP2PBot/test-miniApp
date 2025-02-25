const createTransaction = (data: any) => {
    console.log('createTransaction', data);
};

const updateTransaction = (data:any) => {
    console.log('updateTransaction', data);
};

const mapActions: Record<string, Function> = {
    'create': createTransaction,
    'update': updateTransaction,
};

const handleMessage = (event: MessageEvent) => {
    const { data } = event;
    const functionToCall = mapActions[data.action]  || (() => console.error('invalid_action'));
    return functionToCall(data);  
};


self.addEventListener('message', handleMessage);

self.postMessage({ result: 'success' });