import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      'mongodb+srv://zigza2117:zigza2117@cluster0.n7fa3.mongodb.net/zigzaDatabase?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      }
    )
    console.log(`MongoDB Connected : ${conn.connection.host}`)
  } catch (error) {
    console.log(`Mongo error :${error}`)
    process.exit(1)
  }
}
export default connectDB
