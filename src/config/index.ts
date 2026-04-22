import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    cloudinary: {
        api_secret: process.env.CLOUDINARY_API_SECRET,
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
    },
    password_hash: process.env.BCRYPT_SALT_ROUNDS,
    jwt_access_Token: process.env.JWT_ACCESS_TOKEN,
    jwt_refresh_Token: process.env.JWT_REFRESH_TOKEN,
    openRouterApiKey: process.env.OPENROUTER_API_KEY, //61-01
    stripeSceretKey: process.env.STRIPE_SECRET_KEY,
}