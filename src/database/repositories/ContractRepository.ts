import { BaseRepository } from "./BaseRepository";
import { ContractModel, IContract } from "../models/Contract";
import { ContractVersionModel, IContractVersion } from "../models/ContractVersion";
import mongoose from "mongoose";

export class ContractRepository extends BaseRepository<IContract> {
  constructor() {
    super(ContractModel);
  }

  /**
   * Creates a new contract along with its initial version.
   */
  async createWithInitialVersion(
    contractData: Partial<IContract>,
    versionData: Partial<IContractVersion>
  ): Promise<{ contract: IContract; version: IContractVersion }> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create Contract
      const contract = new this.model(contractData);
      await contract.save({ session });

      // Create initial Contract Version
      const version = new ContractVersionModel({
        ...versionData,
        contractId: contract._id,
        versionNumber: 1,
      });
      await version.save({ session });

      // Link version to contract
      contract.currentVersionId = version._id as mongoose.Types.ObjectId;
      await contract.save({ session });

      await session.commitTransaction();
      return { contract, version };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async findByOwnerId(ownerId: string): Promise<IContract[]> {
    return this.find({ ownerId });
  }
}

export const contractRepository = new ContractRepository();
