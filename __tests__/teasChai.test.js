import chai from 'chai'
import chaiGraphQL from 'chai-graphql'
chai.use(chaiGraphQL)


const { assert } = chai
const baseUrl = "https://graphql-teas-endpoint.netlify.app/"
const request = require('supertest')(baseUrl);
const expect = chai.expect

describe('testing teas enpoint with chai', ()=> {
    it('should query data from teas endpoint', done =>{
        request
      .post("/")
      .send({
        query: "{ teas { id, name} }",
      })
      .set("Accept", "application/json")
      .end((err, res) => {
        // res will be valid graphql response
        if (err) return done(err);
        assert.graphQL(res.body);
      done()
      })
    })
})