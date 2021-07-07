import chai from 'chai'
import chaiGraphQL from 'chai-graphql'
chai.use(chaiGraphQL)


const { assert } = chai
const baseUrl = "https://graphql-teas-endpoint.netlify.app/"
const request = require('supertest')(baseUrl);
const expect = chai.expect


//test data

const teaName = "Lemon Balm"

describe('testing teas endpoint with chai graphql assertions', ()=> {
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
    it('should be able to query tea by name', done => {
      request
      .post("/")
      .send({
        query: '{ teas(name: "Lemon Balm") { id, name} }',
      })
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.a('object')
        expect(res.body.data.teas).to.have.lengthOf(1);
      done()
      })
    })

    it('should return an empty array when no data is found', done => {
      request
      .post("/")
      .send({
        query: '{ teas(name: "Lemonnn Balm") { id, name} }',
      })
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.a('object')
        expect(res.body.data.teas).to.have.lengthOf(0);
      done()
      })
    })
    it('should list all property of return Tea object', done => {
      request
      .post("/")
      .send({
        query: '{ teas(name: "Lemon Balm") { id, name, description, price} }',
      })
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.a('object')
        expect(res.body.data.teas[0]).to.have.property('id')
        expect(res.body.data.teas[0]).to.have.property('name')
        expect(res.body.data.teas[0]).to.have.property('description')
        expect(res.body.data.teas[0]).to.have.property('price')
        done()
      })
    })
})