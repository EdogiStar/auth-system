
require('dotenv').config();

const app =
require('./app');

const connectDB =
require('./config/db');

const port =
process.env.PORT ||
3000;

const startServer =
async () => {

try {

await connectDB();

app.listen(
port,
() => {

console.log(
`Server running on port ${port}`
);

}
);

} catch (
error
) {

console.error(
'Failed:',
error.message
);

process.exit(1);

}

};

startServer();