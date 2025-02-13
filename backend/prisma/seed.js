const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function main() {
    await prisma.threat.createMany({
        data: [
            { host: 'malicious.com', url: 'http://malicious.com/bad', threat_type: 'malware', date_added: new Date() },
            { host: 'phishing-site.com', url: 'http://phishing-site.com/login', threat_type: 'phishing', date_added: new Date() }
        ],
    });
    console.log('Database seeded!');

    const hashedPassword = await bcrypt.hash('password123', 10);
    await prisma.user.create({
        data: {
            username: 'admin',
            password: hashedPassword
        }
    });
    console.log('User seeded!');
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());