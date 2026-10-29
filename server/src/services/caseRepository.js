import crypto from 'crypto';
import CaseModel from '../models/Case.js';
import { getIsConnected } from '../config/db.js';

// In-memory fallback collection
const memoryCases = new Map();

export const CaseRepository = {
  async create(caseData) {
    if (getIsConnected()) {
      const doc = new CaseModel(caseData);
      return await doc.save();
    } else {
      const id = crypto.randomUUID();
      const now = new Date();
      const doc = {
        _id: id,
        id,
        ...caseData,
        createdAt: now,
        updatedAt: now,
        async save() {
          this.updatedAt = new Date();
          memoryCases.set(this._id.toString(), { ...this });
          return this;
        }
      };
      memoryCases.set(id, doc);
      return doc;
    }
  },

  async findById(id) {
    if (getIsConnected()) {
      return await CaseModel.findById(id);
    } else {
      const doc = memoryCases.get(id?.toString());
      if (!doc) return null;
      // return a clone that has .save()
      return {
        ...doc,
        async save() {
          this.updatedAt = new Date();
          memoryCases.set(this._id.toString(), { ...this });
          return this;
        }
      };
    }
  },

  async find(query = {}) {
    if (getIsConnected()) {
      return await CaseModel.find(query).sort({ createdAt: -1 }).limit(20);
    } else {
      let list = Array.from(memoryCases.values());
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return list.slice(0, 20);
    }
  }
};

export default CaseRepository;
