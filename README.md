# FIXIT
<!-- to add .env -->
cp env-example-relational .env
<!-- to Install dependency -->
npm install
<!-- to Genrate migrations -->
npm run migration:generate -- src/database/migrations/<!-- name here -->
<!-- to Run migrations -->
npm run migration:run
<!-- to Revert migration -->
npm run migration:revert
<!-- to Drop all tables in database -->
npm run schema:drop
<!-- to Run seeds -->
npm run seed:run:relational
<!-- to run app in dev mode -->
npm run start:dev
<!-- to generate resource -->
npm run generate:resource:document -- --name=<!-- name here -->
<!-- to add property -->
npm run add:property:to-relational
<!-- to Run app configuration only one time -->
npm run app:config

[Open](http://localhost:3000)
[Open](http://localhost:3000/docs)
