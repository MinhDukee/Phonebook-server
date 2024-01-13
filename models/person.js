const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
const password = "BestbelieveImstillbejeweled"

const url =
  `mongodb+srv://MD:${password}@cluster0.dpqj8dr.mongodb.net/?retryWrites=true&w=majority`


const connectToDb = async () =>{
    await mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
      })
      .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
      })
   }
   connectToDb()

const PersonSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function(v) {
        return /\d{2,3}-/.test(v);
      },     
      message: props => `${props.value} is not a valid phone number!`
    },

  }
  
})

PersonSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', PersonSchema)
