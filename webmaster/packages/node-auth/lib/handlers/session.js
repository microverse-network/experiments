module.exports = async (req, res) => {
  const { id: _id } = req.params
  const count = await req.node.db.get('sessions').count({ _id })
  if (count === 1) {
    res.send()
  } else {
    res.status(401).send()
  }
}
