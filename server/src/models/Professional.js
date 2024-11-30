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

const ProfessionalExperienceSchema = new Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  currentlyWorking: { type: Boolean, required: true },
  description: { type: String, required: true }
})

const AcademicEducationSchema = new Schema({
  institution: { type: String, required: true },
  course: { type: String, required: true },
  degree: { type: String, required: true },
  startYear: { type: Number, required: true },
  endYear: { type: Number }
})

const CertificationSchema = new Schema({
  name: { type: String, required: true },
  institution: { type: String, required: true },
  issueDate: { type: Date, required: true },
  expirationDate: { type: Date }
})

const ProfessionalSchema = new Schema({
  name: { type: String, required: true },
  gender: { type: String },
  birthDate: { type: Date, required: true },
  maritalStatus: { type: String },
  nationality: { type: String },
  address: { type: AddressSchema, required: true },
  profileImage: { type: String, required: true },

  cpf: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },

  linkedin: { type: String },
  github: { type: String },
  portfolio: { type: String },

  professionalExperience: {
    type: [ProfessionalExperienceSchema],
    required: true
  },
  academicEducation: { type: [AcademicEducationSchema], required: true },
  skills: { type: [String], required: true }, // Referenciado pelo id do admin
  languages: { type: [String], required: true }, // Referenciado pelo id do admin
  certifications: { type: [CertificationSchema], required: true },
  interests: { type: [String] },

  role: { type: String, required: true },
  seniority: { type: String, required: true },
  availability: { type: String, required: true },
  salaryExpectation: { type: Number },

  subscriptionId: { type: Number }
})

export default mongoose.model('Professional', ProfessionalSchema)
