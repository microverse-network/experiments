module.exports = doc => {
  return {
    id: doc._id,
    email: doc.email,
    name: doc.name,
  }
}
