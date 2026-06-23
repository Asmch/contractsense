import mongoose, { Model, Document } from "mongoose";

export abstract class BaseRepository<T extends Document> {
  protected constructor(protected readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    const document = new this.model(data);
    return document.save();
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async findOne(query: mongoose.QueryFilter<T>): Promise<T | null> {
    return this.model.findOne(query).exec();
  }

  async find(query: mongoose.QueryFilter<T> = {}): Promise<T[]> {
    return this.model.find(query).exec();
  }

  async update(id: string, data: mongoose.UpdateQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
