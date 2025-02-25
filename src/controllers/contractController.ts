

export class ContractController {
  private workerService: Worker;

    constructor(){
        this.workerService = new Worker('../workers/transactionWorker.ts');
    }

    public async getContractState(){
        return this.workerService.postMessage('getContractState');
    }
    public async initTransaction(data: any){
        return this.workerService.postMessage({ action: 'create', data });
    }
}