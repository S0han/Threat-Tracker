const prisma = require('../config/db');
const argon2 = require('argon2');

async function main() {
    await prisma.threat.createMany({
        data: [
            { host: 'malicious.com', url: 'http://malicious.com/bad', threat_type: 'malware', date_added: new Date() },
            { host: 'phishing-site.com', url: 'http://phishing-site.com/login', threat_type: 'phishing', date_added: new Date() }
        ],
    });
    console.log('Database seeded!');

    const hashedPassword = await argon2.hash('password123');
    await prisma.user.create({
        data: {
            username: 'admin',
            password: hashedPassword
        }
    });
    console.log('User seeded!');
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());