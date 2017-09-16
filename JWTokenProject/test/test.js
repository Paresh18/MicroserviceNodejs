let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);


//Get login page 
describe('/login', () => {
      it('the login page is loaded successfully', (done) => {
        chai.request(server)
            .get('/login')
            .end((err, res) => {
                res.should.have.status(200);

              done();
            });
      });
  });



//not posting without a user field
describe('/post tokeninfo', () => {
      it('it should not POST a user without form field', (done) => {
        let user= {
            name: "Paresh",   
        }
        chai.request(server)
            .post('/tokeninfo')
            .send(user)
            .end((err, res) => {
                res.should.have.status(500);
              done();
            });
      });
  });



//get token
describe('/POST user detail', () => {
      it('it should POST a username and pass to return token ', (done) => {
        let user = {
            name: "Paresh",
            password: "password"          
        }
        chai.request(server)
            .post('/authenticate')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
              done();
            });
      });
})


//using get request to access /tokeninfo page
describe('/getting token page when using get request', () => {
      it('it should not allow to open the tokeninfo on get request ', (done) => {
        
        chai.request(server)
            .get('/tokeninfo')
            .end((err, res) => {
                res.should.have.status(403);
              done();
            });
      });
})


//Jsonpatch page
describe('/displaying jsonpatch page when the url has token in its header ', () => {
      it('it should allow jsonpatch page to display when it has token in its header ', (done) => {
        /*just using the token when the username is 'Paresh' and 'Password'*/
        chai.request(server)
            .get('/jsonpatch?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwic2VsZWN0ZWQiOnt9LCJnZXR0ZXJzIjp7fSwiX2lkIjoiNTliOTEyZTQ0OGMwNDYxY2M4Yzg1MjBlIiwid2FzUG9wdWxhdGVkIjpmYWxzZSwiYWN0aXZlUGF0aHMiOnsicGF0aHMiOnsiX192IjoiaW5pdCIsImFkbWluIjoiaW5pdCIsInBhc3N3b3JkIjoiaW5pdCIsIm5hbWUiOiJpbml0IiwiX2lkIjoiaW5pdCJ9LCJzdGF0ZXMiOnsiaWdub3JlIjp7fSwiZGVmYXVsdCI6e30sImluaXQiOnsiX192Ijp0cnVlLCJhZG1pbiI6dHJ1ZSwicGFzc3dvcmQiOnRydWUsIm5hbWUiOnRydWUsIl9pZCI6dHJ1ZX0sIm1vZGlmeSI6e30sInJlcXVpcmUiOnt9fSwic3RhdGVOYW1lcyI6WyJyZXF1aXJlIiwibW9kaWZ5IiwiaW5pdCIsImRlZmF1bHQiLCJpZ25vcmUiXX0sInBhdGhzVG9TY29wZXMiOnt9LCJlbWl0dGVyIjp7ImRvbWFpbiI6bnVsbCwiX2V2ZW50cyI6e30sIl9ldmVudHNDb3VudCI6MCwiX21heExpc3RlbmVycyI6MH19LCJpc05ldyI6ZmFsc2UsIl9kb2MiOnsiX192IjowLCJhZG1pbiI6dHJ1ZSwicGFzc3dvcmQiOiJwYXNzd29yZCIsIm5hbWUiOiJQYXJlc2giLCJfaWQiOiI1OWI5MTJlNDQ4YzA0NjFjYzhjODUyMGUifSwiJGluaXQiOnRydWUsImlhdCI6MTUwNTM3NjkyOSwiZXhwIjoxNTA1NDYzMzI5fQ.QPNHraf55E_tAkeBFDkrO6X-14rzsPD_kWqSAY_rPdU')
            .end((err, res) => {
                res.should.have.status(200);
              done();
            });
      });
})



describe('/ Not displaying jsonpatch page information when having no token in its url ', () => {
      it('it should  not allow jsonpatch page to display when it has no token in its header ', (done) => {
       
        chai.request(server)
            .get('/jsonpatch')
            .end((err, res) => {
                res.should.have.status(403);
              done();
            });
      });
})


//Jsonpatchresult page

describe('/displaying jsonpatchresult page when the url has token in its header ', () => {
      it('it should allow jsonpatchresult page to display when it has token in its header ', (done) => {
        /*just using the token when the username is 'Paresh' and 'Password'*/
        chai.request(server)
            .get('/jsonpatchresult?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwic2VsZWN0ZWQiOnt9LCJnZXR0ZXJzIjp7fSwiX2lkIjoiNTliOTEyZTQ0OGMwNDYxY2M4Yzg1MjBlIiwid2FzUG9wdWxhdGVkIjpmYWxzZSwiYWN0aXZlUGF0aHMiOnsicGF0aHMiOnsiX192IjoiaW5pdCIsImFkbWluIjoiaW5pdCIsInBhc3N3b3JkIjoiaW5pdCIsIm5hbWUiOiJpbml0IiwiX2lkIjoiaW5pdCJ9LCJzdGF0ZXMiOnsiaWdub3JlIjp7fSwiZGVmYXVsdCI6e30sImluaXQiOnsiX192Ijp0cnVlLCJhZG1pbiI6dHJ1ZSwicGFzc3dvcmQiOnRydWUsIm5hbWUiOnRydWUsIl9pZCI6dHJ1ZX0sIm1vZGlmeSI6e30sInJlcXVpcmUiOnt9fSwic3RhdGVOYW1lcyI6WyJyZXF1aXJlIiwibW9kaWZ5IiwiaW5pdCIsImRlZmF1bHQiLCJpZ25vcmUiXX0sInBhdGhzVG9TY29wZXMiOnt9LCJlbWl0dGVyIjp7ImRvbWFpbiI6bnVsbCwiX2V2ZW50cyI6e30sIl9ldmVudHNDb3VudCI6MCwiX21heExpc3RlbmVycyI6MH19LCJpc05ldyI6ZmFsc2UsIl9kb2MiOnsiX192IjowLCJhZG1pbiI6dHJ1ZSwicGFzc3dvcmQiOiJwYXNzd29yZCIsIm5hbWUiOiJQYXJlc2giLCJfaWQiOiI1OWI5MTJlNDQ4YzA0NjFjYzhjODUyMGUifSwiJGluaXQiOnRydWUsImlhdCI6MTUwNTM3NjkyOSwiZXhwIjoxNTA1NDYzMzI5fQ.QPNHraf55E_tAkeBFDkrO6X-14rzsPD_kWqSAY_rPdU')
            .end((err, res) => {
                res.should.have.status(200);
              done();
            });
      });
})



describe('/ Not displaying jsonpatchresult page information when having no token in its url ', () => {
      it('it should  not allow jsonpatchresult page to display when it has no token in its header ', (done) => {
       
        chai.request(server)
            .get('/jsonpatchresult')
            .end((err, res) => {
                res.should.have.status(403);
              done();
            });
      });
});

//thumbnail page
describe('/displaying thumbnail page when the url has token in its header ', () => {
      it('it should allow thumbnail page to display when it has token in its header ', (done) => {
        /*just using the token when the username is 'Paresh' and 'Password'*/
        chai.request(server)
            .get('/thumbnail?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwic2VsZWN0ZWQiOnt9LCJnZXR0ZXJzIjp7fSwiX2lkIjoiNTliOTEyZTQ0OGMwNDYxY2M4Yzg1MjBlIiwid2FzUG9wdWxhdGVkIjpmYWxzZSwiYWN0aXZlUGF0aHMiOnsicGF0aHMiOnsiX192IjoiaW5pdCIsImFkbWluIjoiaW5pdCIsInBhc3N3b3JkIjoiaW5pdCIsIm5hbWUiOiJpbml0IiwiX2lkIjoiaW5pdCJ9LCJzdGF0ZXMiOnsiaWdub3JlIjp7fSwiZGVmYXVsdCI6e30sImluaXQiOnsiX192Ijp0cnVlLCJhZG1pbiI6dHJ1ZSwicGFzc3dvcmQiOnRydWUsIm5hbWUiOnRydWUsIl9pZCI6dHJ1ZX0sIm1vZGlmeSI6e30sInJlcXVpcmUiOnt9fSwic3RhdGVOYW1lcyI6WyJyZXF1aXJlIiwibW9kaWZ5IiwiaW5pdCIsImRlZmF1bHQiLCJpZ25vcmUiXX0sInBhdGhzVG9TY29wZXMiOnt9LCJlbWl0dGVyIjp7ImRvbWFpbiI6bnVsbCwiX2V2ZW50cyI6e30sIl9ldmVudHNDb3VudCI6MCwiX21heExpc3RlbmVycyI6MH19LCJpc05ldyI6ZmFsc2UsIl9kb2MiOnsiX192IjowLCJhZG1pbiI6dHJ1ZSwicGFzc3dvcmQiOiJwYXNzd29yZCIsIm5hbWUiOiJQYXJlc2giLCJfaWQiOiI1OWI5MTJlNDQ4YzA0NjFjYzhjODUyMGUifSwiJGluaXQiOnRydWUsImlhdCI6MTUwNTM3NjkyOSwiZXhwIjoxNTA1NDYzMzI5fQ.QPNHraf55E_tAkeBFDkrO6X-14rzsPD_kWqSAY_rPdU')
            .end((err, res) => {
                res.should.have.status(200);
              done();
            });
      });
})



//not displaying the page when it has no token in header
describe('/ Not displaying thumbnail page information when having no token in its url ', () => {
      it('it should  not allow thumbnail page to display when it has no token in its header ', (done) => {
       
        chai.request(server)
            .get('/thumbnail')
            .end((err, res) => {
                res.should.have.status(403);
              done();
            });
      });
});




//not posting without a correct imageurl field
describe('/Incorrect or empty imageurl ', () => {
      it('it should not POST a imageurl without form field', (done) => {
        let imgurl= {
            imageurl: " ",   
        }
        chai.request(server)
            .post('/thumbnailresult')
            .send(imgurl)
            .end((err, res) => {
                res.should.have.status(200);
              done();
            });
      });
  });



//thumbnailresult page
describe('/displaying thumbnailresult page when the url has token in its header but not showed ', () => {
      it('it should allow thumbnailresult page to display when it has token in its header but not showed ', (done) => {
        /*just using the token when the username is 'Paresh' and 'Password'*/
        chai.request(server)
            .post('/thumbnailresult')
            .end((err, res) => {
                res.should.have.status(200);
              done();
            });
      });
})


describe('/displaying thumbnailresult page when the url has no token', () => {
      it('it should allow thumbnailresult page to display when it has no token', (done) => {
        /*just using the token when the username is 'Paresh' and 'Password'*/
        chai.request(server)
            .get('/thumbnailresult')
            .end((err, res) => {
                res.should.have.status(403);
              done();
            });
      });
})















