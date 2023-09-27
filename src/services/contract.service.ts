import { IContract } from 'interfaces/contract.interface';
import { config } from 'config/config';

import Contract from 'models/contract.model';
import { checkFieldsMatching, loadModel } from 'utils/utils';

// Contract Service
class ContractService {
  private contractModel: any;
  private static instance: ContractService;

  private constructor() {
    this.initContractModel();
  }

  public static getInstance(): ContractService {
    if (!ContractService.instance) {
      ContractService.instance = new ContractService();
    }
    return ContractService.instance;
  }

  private initContractModel() {
    console.time('initContractModel');
    this.contractModel = loadModel(config.contract.modelPath);
    console.timeEnd('initContractModel');
  }

  // Validate the contract input data against the contract model
  public isValid(contract: IContract): boolean {
    if (!this.contractModel) {
      throw new Error('No contract model found.');
    }
    // Perform validation
    const matching = checkFieldsMatching(contract, this.contractModel);
    if (!matching.success) {
      throw new Error(`${matching.success} is an invalid field.`);
    }
    return matching.success;
  }

  // Generate a contract based on the contract data
  public genContract(contractData: IContract): Promise<IContract> {
    if (!this.contractModel) {
      throw new Error('No contract model found.');
    }
    // Validate the contract input data against the contract model
    this.isValid(contractData);
    // Generate the contrat after validation
    const newContract = new Contract(contractData);
    return newContract.save();
  }
}

export default ContractService.getInstance();
