const baseUrl = "https://graphql-teas-endpoint.netlify.app/"
const request = require('supertest')(baseUrl);

describe('Testing teas query', () => {
  it('simple request to get all teas', (done) => {
    request
      .post("/")
      .send({
        query: "{ teas { id, name} }",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).toBeInstanceOf(Object)
        // console.log('response', res);
        done();
      })
  })
  it('wrong request to get all teas', (done) => {
    request
      .post("/")
      .send({
        query: "{ teas() { id, name} }",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.statusCode).toBe(400)
        expect(res.clientError)
        console.log('response', res.body);
        done();
      })
  })
})
