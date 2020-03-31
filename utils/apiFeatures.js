class APIFeatures {
  constructor (query, queryString) {
    this.query = query
    this.queryString = queryString
  }

  inputCommaToSpace (input) { return input.split(',').join(' ') }

  filter () {
    const queryObject = { ...this.queryString }
    const excludedFields = ['page', 'sort', 'limit', 'fields']
    excludedFields.forEach(field => delete queryObject[field])
    let queryStr = JSON.stringify(queryObject)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)

    this.query = this.query.find(JSON.parse(queryStr))
    return this
  }

  sort () {
    if (this.queryString.sort) {
      const sortBy = this.inputCommaToSpace(this.queryString.sort)
      this.query = this.query.sort(sortBy)
    } else {
      this.query = this.query.sort('-createdAt')
    }
    return this
  }

  limitFields () {
    if (this.queryString.fields) {
      const fields = this.inputCommaToSpace(this.queryString.fields)
      this.query = this.query.select(fields)
    } else {
      this.query = this.query.select('-__v')
    }
    return this
  }

  paginate () {
    const page = parseInt(this.queryString.page) || 1
    const limit = parseInt(this.queryString.limit) || 100
    const skip = (page - 1) * limit
    this.query = this.query.skip(skip).limit(limit)
    return this
  }
}

module.exports = APIFeatures
