const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://sodaniels:${password}@od20.rlnkt2r.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personsSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
})

const Person = mongoose.model('Person', personsSchema)

// Query: list entire db
if (process.argv.length == 3) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.phoneNumber}`)
    })
    mongoose.connection.close()
  })
}

// Query: add an entry
if (process.argv.length > 3) {
  // if the user forgets to add the number:
  if (process.argv.length == 4) {
    console.log(
      'Error: commands should be in the format "node mongo.js [password] name number"'
    )
    process.exit(1)
  }

  // Add entry then give success message
  const person = new Person({
    name: process.argv[3],
    phoneNumber: process.argv[4],
  })

  person.save().then(
    response => {
    console.log(
      `added ${person.name} number ${person.phoneNumber} to phonebook.`
    )
    mongoose.connection.close()
  })
}
