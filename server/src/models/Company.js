import mongoose from 'mongoose'

const { Schema } = mongoose

const AddressSchema = new Schema({
  street: { type: String, required: true },
  number: { type: String, required: true },
  complement: { type: String },
  neighborhood: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true }
})

// const JobOpeningSchema = new Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   requirements: { type: [String], required: true },
//   benefits: { type: [String], required: true },
//   location: { type: String, required: true },
//   contractType: { type: String, required: true },
//   salary: { type: String, required: true },
//   publicationDate: { type: Date, required: true },
//   closingDate: { type: Date },
// });

const CompanySchema = new Schema({
  tradeName: { type: String, required: true },
  corporateName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  cnpj: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: AddressSchema, required: true },
  sector: { type: String, required: true },
  size: { type: String, required: true },
  description: { type: String, required: true },
  website: { type: String },
  linkedin: { type: String },
  jobOpenings: { type: [String], default: [] },
  subscriptionId: { type: Number }
})

export default mongoose.model('Company', CompanySchema)
