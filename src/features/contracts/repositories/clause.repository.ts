import { ContractClauseModel, IContractClause } from "@/database/models/ContractClause";
import mongoose from "mongoose";

export class ContractClauseRepository {
  /**
   * Create multiple clauses in bulk
   */
  static async createMany(clauses: Partial<IContractClause>[]): Promise<IContractClause[]> {
    return await ContractClauseModel.insertMany(clauses);
  }

  /**
   * Find all clauses for a specific contract, ordered by their sequence
   */
  static async findByContract(contractId: string): Promise<IContractClause[]> {
    return await ContractClauseModel.find({ contractId })
      .sort({ order: 1 })
      .lean();
  }

  /**
   * Delete all existing clauses for a contract (useful for retries)
   */
  static async deleteByContract(contractId: string): Promise<void> {
    await ContractClauseModel.deleteMany({ contractId });
  }

  /**
   * Count how many clauses were detected for a contract
   */
  static async countByContract(contractId: string): Promise<number> {
    return await ContractClauseModel.countDocuments({ contractId });
  }
}
