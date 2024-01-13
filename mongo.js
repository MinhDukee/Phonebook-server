const mongoose = require('mongoose')

if (process.argv.length<3) {
	console.log('give password as argument')
	process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://MD:${password}@cluster0.dpqj8dr.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)

const connectToDb = async () => {
	await mongoose.connect(url)
}
connectToDb()

const PersonSchema = new mongoose.Schema({
	name: String,
	number: String
})

const Person = mongoose.model('Person', PersonSchema)

let args = process.argv

if (args.length === 5){
	const person = new Person({
		name: process.argv[3],
		number: process.argv[4],
	})


	person.save().then(() => {
		console.log('Person saved!')
		mongoose.connection.close()
	})
} else {
	// eslint-disable-next-line no-inner-declarations
	async function dosomething(){
		const persons = await Person.find()
		console.log('phonebook:')
		for(let i = 0; i<persons.length; i++){
			console.log(`${persons[i].name} ${persons[i].number}`)
		}
	}
	dosomething()

}

