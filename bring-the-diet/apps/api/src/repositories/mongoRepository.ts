import { Collection, ObjectId, WithId } from 'mongodb';

export type BaseDoc = {
  _id?: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};

export type ListParams = {
  q?: string;
  limit?: number;
  skip?: number;
  sort?: string; // field:asc|desc
};

export class MongoRepository<T extends BaseDoc> {
  constructor(private collection: Collection<T>, private searchFields: (keyof T)[] = []) {}

  async list(params: ListParams = {}) {
    const limit = Math.min(Math.max(params.limit ?? 25, 1), 200);
    const skip = Math.max(params.skip ?? 0, 0);

    const filter: any = { $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }] };

    if (params.q && this.searchFields.length > 0) {
      const regex = new RegExp(params.q, 'i');
      filter.$and = [
        {
          $or: this.searchFields.map((f) => ({ [f as string]: regex }))
        }
      ];
    }

    let sort: any = { updatedAt: -1 };
    if (params.sort) {
      const [field, dir] = params.sort.split(':');
      sort = { [field]: dir === 'asc' ? 1 : -1 };
    }

    const cursor = this.collection.find(filter).sort(sort).skip(skip).limit(limit);
    const items = await cursor.toArray();
    const total = await this.collection.countDocuments(filter);
    return { items: items.map(this.toClient), total, limit, skip };
  }

  async get(id: string) {
    const _id = new ObjectId(id);
    const doc = await this.collection.findOne({ _id } as any);
    return doc ? this.toClient(doc as any) : null;
  }

  async create(input: Omit<T, keyof BaseDoc>) {
    const now = new Date();
    const doc = {
      ...(input as any),
      createdAt: now,
      updatedAt: now,
      deletedAt: null
    } as T;

    const result = await this.collection.insertOne(doc);
    return this.get(result.insertedId.toHexString());
  }

  async update(id: string, patch: Partial<Omit<T, keyof BaseDoc>>) {
    const _id = new ObjectId(id);
    const now = new Date();
    await this.collection.updateOne(
      { _id } as any,
      { $set: { ...(patch as any), updatedAt: now }, $setOnInsert: { createdAt: now } }
    );
    return this.get(id);
  }

  async archive(id: string) {
    const _id = new ObjectId(id);
    const now = new Date();
    await this.collection.updateOne({ _id } as any, { $set: { deletedAt: now, updatedAt: now } });
    return { ok: true };
  }

  private toClient = (doc: WithId<T>) => {
    const { _id, ...rest } = doc as any;
    return { id: _id.toHexString(), ...rest };
  };
}
