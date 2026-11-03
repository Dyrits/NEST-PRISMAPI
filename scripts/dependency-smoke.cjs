const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { Test } = require('@nestjs/testing');
const { ValidationPipe } = require('@nestjs/common');
const request = require('supertest');
const root = path.resolve(__dirname, '..');
const kind = process.env.SMOKE_KIND;
(async () => {
  let app;
  const oldCwd = process.cwd();
  let scratch;
  try {
    let module;
    if (kind === 'messages') {
      scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'nestsages-smoke-'));
      fs.mkdirSync(path.join(scratch, 'data'));
      fs.writeFileSync(path.join(scratch, 'data/messages.json'), '{}');
      process.chdir(scratch);
      const { MessagesModule } = require(path.join(root, 'dist/messages/messages.module'));
      module = await Test.createTestingModule({ imports: [MessagesModule] }).compile();
      await new Promise(resolve => setTimeout(resolve, 30));
    } else if (kind === 'expense') {
      const { AppModule } = require(path.join(root, 'dist/app.module'));
      module = await Test.createTestingModule({ imports: [AppModule] }).compile();
    } else if (kind === 'authentication') {
      const { AuthenticationController } = require(path.join(root, 'dist/authentication/authentication.controller'));
      const { AuthenticationService } = require(path.join(root, 'dist/authentication/authentication.service'));
      module = await Test.createTestingModule({
        controllers: [AuthenticationController],
        providers: [{ provide: AuthenticationService, useValue: {
          register: async () => ({ access_token: 'isolated-test-token' }),
          authenticate: async () => ({ access_token: 'isolated-test-token' })
        } }]
      }).compile();
    } else throw new Error('SMOKE_KIND must identify the project');
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    const http = request(app.getHttpServer());
    if (kind === 'messages') {
      await http.get('/messages').expect(200).expect([]);
      await http.post('/messages').send({ content: '', author: '' }).expect(400);
      const created = await http.post('/messages').send({ content: 'Scratch message', author: 'Smoke' }).expect(201);
      assert.equal(created.body.content, 'Scratch message');
      const read = await http.get('/messages/' + created.body.id).expect(200);
      assert.equal(read.body.author, 'Smoke');
      const list = await http.get('/messages').expect(200);
      assert.equal(list.body.length, 1);
      await new Promise(resolve => setTimeout(resolve, 80));
      assert.match(fs.readFileSync(path.join(scratch, 'data/messages.json'), 'utf8'), /Scratch message/);
    } else if (kind === 'expense') {
      await http.post('/reports/expense').send({ source: '', amount: -1 }).expect(400);
      const created = await http.post('/reports/expense').send({ source: 'Smoke', amount: 5 }).expect(201);
      assert.equal(created.body.source, 'Smoke');
      const id = created.body.id;
      await http.get('/reports/expense/' + id).expect(200);
      const updated = await http.patch('/reports/expense/' + id).send({ amount: 8 }).expect(200);
      assert.equal(updated.body.amount, 8);
      await http.get('/summary').expect(200);
      await http.delete('/reports/expense/' + id).expect(204);
      await http.get('/reports/expense/' + id).expect(404);
    } else {
      await http.post('/authentication/sign-up').send({ email: 'invalid', password: 'x' }).expect(400);
      const response = await http.post('/authentication/sign-up').send({ email: 'smoke@example.invalid', password: 'test-password' }).expect(201);
      assert.equal(response.body.access_token, 'isolated-test-token');
      await http.post('/authentication/sign-in').send({ email: 'smoke@example.invalid', password: 'test-password' }).expect(201);
    }
    // Exercise the patched compressed-body path through a real HTTP socket.
    await app.listen(0, '127.0.0.1');
    const port = app.getHttpServer().address().port;
    const endpoint = kind === 'messages' ? '/messages' : kind === 'expense' ? '/reports/expense' : '/authentication/sign-up';
    const compressed = require('node:zlib').gzipSync(Buffer.from('{}'));
    const malformed = Buffer.concat([compressed, Buffer.from('invalid trailing bytes')]);
    const status = await new Promise((resolve, reject) => {
      const req = require('node:http').request({ host: '127.0.0.1', port, path: endpoint, method: 'POST', headers: {
        'Content-Type': 'application/json', 'Content-Encoding': 'gzip', 'Content-Length': malformed.length
      } }, response => { response.resume(); response.on('end', () => resolve(response.statusCode)); });
      req.setTimeout(2000, () => req.destroy(new Error('compressed request hung')));
      req.on('error', reject);
      req.end(malformed);
    });
    assert.equal(status, 400, 'invalid compressed body must be rejected without hanging');
    await http.post(endpoint).send({}).expect(400);
    console.log('PASS isolated HTTP smoke and malformed gzip rejection: ' + kind);
  } finally {
    if (app) await app.close();
    process.chdir(oldCwd);
    if (scratch) fs.rmSync(scratch, { recursive: true, force: true });
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
