import mongoose, { Document, Schema } from 'mongoose';

export interface IEquipment {
  name: string;
  quantity: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  lastMaintenance: string;
  nextMaintenance: string;
}

export interface ILab {
  name: string;
  capacity: number;
  location: string;
  equipment: IEquipment[];
  facilities: string[];
  availability: string;
}

export interface IInfrastructure extends Document {
  department: string;
  labs: ILab[];
  classrooms: {
    total: number;
    capacity: number;
    facilities: string[];
  };
  library: {
    books: number;
    journals: number;
    digitalResources: number;
    seatingCapacity: number;
    facilities: string[];
  };
  computerLabs: {
    total: number;
    computers: number;
    specifications: string;
    software: string[];
  };
  researchFacilities: {
    name: string;
    description: string;
    equipment: string[];
    capacity: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const EquipmentSchema = new Schema<IEquipment>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  condition: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor'],
    required: true
  },
  lastMaintenance: {
    type: String,
    required: true
  },
  nextMaintenance: {
    type: String,
    required: true
  }
}, { _id: false });

const LabSchema = new Schema<ILab>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  equipment: [EquipmentSchema],
  facilities: [{
    type: String,
    trim: true
  }],
  availability: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

const ResearchFacilitySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  equipment: [{
    type: String,
    trim: true
  }],
  capacity: {
    type: Number,
    required: true,
    min: 1
  }
}, { _id: false });

const InfrastructureSchema = new Schema<IInfrastructure>({
  department: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  labs: [LabSchema],
  classrooms: {
    total: {
      type: Number,
      required: true,
      min: 0
    },
    capacity: {
      type: Number,
      required: true,
      min: 0
    },
    facilities: [{
      type: String,
      trim: true
    }]
  },
  library: {
    books: {
      type: Number,
      required: true,
      min: 0
    },
    journals: {
      type: Number,
      required: true,
      min: 0
    },
    digitalResources: {
      type: Number,
      required: true,
      min: 0
    },
    seatingCapacity: {
      type: Number,
      required: true,
      min: 0
    },
    facilities: [{
      type: String,
      trim: true
    }]
  },
  computerLabs: {
    total: {
      type: Number,
      required: true,
      min: 0
    },
    computers: {
      type: Number,
      required: true,
      min: 0
    },
    specifications: {
      type: String,
      required: true,
      trim: true
    },
    software: [{
      type: String,
      trim: true
    }]
  },
  researchFacilities: [ResearchFacilitySchema]
}, {
  timestamps: true,
  collection: 'infrastructure'
});

// Indexes for better query performance
InfrastructureSchema.index({ department: 1 });
InfrastructureSchema.index({ 'labs.name': 'text' });
InfrastructureSchema.index({ 'researchFacilities.name': 'text' });

export const Infrastructure = mongoose.model<IInfrastructure>('Infrastructure', InfrastructureSchema);
