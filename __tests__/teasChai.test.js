import chai, { should } from 'chai'
import chaiGraphQL from 'chai-graphql'
chai.use(chaiGraphQL)


const { assert } = chai
const baseUrl = "https://graphql-teas-endpoint.netlify.app/"
const request = require('supertest')(baseUrl);
const expect = chai.expect


//test data

const teaName = "Original"
const teaPrice = 0.99
const teaID = "60e5f1c1ec9b5f0008746b1e"

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
        query: `{ teas(name: "${teaName}") { id, name} }`,
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
        query: `{ teas(name: "${teaName}") { id, name, description, price} }`,
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
    it.skip('should be able to add new tea (mutation example)', done => {
      request
      .post("/")
      .send({
        query: `mutation { addTea(teaInput: { name: "Breakfast Tea", description: "Intensive falvour", price: ${teaPrice}, producerId: "60e569889ef12a00084fb979" }){ name price} }`
      })
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.data.addTea.price).to.equal(teaPrice);
        assert.graphQL(res.body)
        done()
      })
    })
    it.skip('should be able to delete a tea', done => {
      request
      .post("/")
      .send({
        query: `mutation { deleteTea(id: "${teaID}") }`
      })
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        assert.graphQL(res.body)
        done()
      })
    })
})