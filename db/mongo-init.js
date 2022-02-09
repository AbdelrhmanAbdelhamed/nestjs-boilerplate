db.auth('admin', 'admin-password');

db = db.getSiblingDB('shortening-service');

db.createUser({
  user: 'shortening-service',
  pwd: 'shortening-service-password',
  roles: [{ role: 'readWrite', db: 'shortening-service' }],
  passwordDigestor: 'server',
});
