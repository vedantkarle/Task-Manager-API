const express = require('express');
require('env-cmd');
require('./db/mongoose.js');
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const app = express();
const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port,()=>{
    console.log('server is running on port ' + port)
})


// const myFunction = async () =>{
//     const password = 'Einstine@7'
//     const hashedPassword = await bcrypt.hash(password, 8)

//     console.log(hashedPassword)


//     const isMatch = await bcrypt.compare(password,hashedPassword)
//     console.log(isMatch)
// }

// myFunction()

// const myFunction = async () =>{
//     const token = jwt.sign({ _id:'12345' }, 'ThisIsSecret',{ expiresIn:'7 days' });
//     console.log(token)

//     const isVerified = jwt.verify(token,'ThisIsSecret');
//     console.log(isVerified)
// }

// myFunction()
// const Task = require("./models/task");
// const User = require('./models/user');

// const main = async()=>{
//     // const task = await Task.findById('5ef1a5bb4c64881524ce6ef7')
//     // await task.populate('author').execPopulate()
//     // console.log(task.author)

//     const user = await User.findById('5ef1a5774c64881524ce6ef4')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)

// }
// main()

