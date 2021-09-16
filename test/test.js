const chai = require('chai');
const request = require('supertest');
const { app } = require('../server');
const {it} = require("faker");

const { expect } = chai;

before(function (done) {
    app.on("appStarted", function(){
        done();
    });
});
const firstUser = {
    id: 1,
    username: 'John Doe',
    password: "root",
    createdAt: '2021-02-08T00:00:00.000Z',
    updatedAt: '2021-02-08T00:00:00.000Z',
};
const secondUser = {
    id: 2,
    username: 'Tom Doe',
    password: "root",
    createdAt: '2021-02-08T00:00:00.000Z',
    updatedAt: '2021-02-08T00:00:00.000Z',
};

describe('Fetch products test', async () => {
    it('Shows all stock states', async () => {
        const { body, status } = await request(app).get('/user');
        const { data } = body;
        expect(status).to.equal(200);
        expect(data).to.deep.include(firstUser);
        expect(data).to.deep.include(secondUser);
    });
});
