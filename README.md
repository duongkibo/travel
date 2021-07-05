# kibo-travel-booking

step 1: download postgresql
step 2: create a postgresql user
step 3: create a postgresql database
step 4: create .env.development file, fill a env variable like that:


APP_PORT=10000

# Database config
DB_TYPE=postgres
DB_PORT=5432
DB_DATABASE=abc
DB_HOST=localhost
DB_USER=âccacaca
DB_PASS=123456
DB_SYNCHRONIZE=true

# JWT config
JWT_EXPIRES_IN=1h
JWT_SECRET= ấccscacs

# BCrypt config
BCRYPT_SALT_ROUNDS=10

# Facebook app config
FACEBOOK_ID=<Your facebook app ID>
FACEBOOK_SECRET=<Your facebook app secret>

# Google app config
GOOGLE_ID=<Your google app ID>
GOOGLE_SECRET=<Your google app secret>

step 5: install node_modules with npm i or yarn
step 6: run project with yarn start:dev(exp)

step 7: run swagger with localhost:PORT/api
