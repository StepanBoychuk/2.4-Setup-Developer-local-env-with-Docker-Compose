const dotenv = require('dotenv'); 
const pg = require('pg');
const redis = require('redis');
const amqp = require('amqplib');

dotenv.config();

const db_client = new pg.Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
});

const redis_client =  redis.createClient({
    url: `${process.env.REDIS_URL}:${process.env.REDIS_PORT}`
}).on('error', err => console.log('Redis Client Error', err))

const connectToRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`);
        const channel= await connection.createChannel();
        await channel.assertQueue('test-queue');
    } catch (error) {
        console.error(error)
    }
}

db_client.connect();
redis_client.connect();
connectToRabbitMQ();