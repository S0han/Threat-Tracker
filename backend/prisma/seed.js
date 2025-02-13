const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    await prisma.threat.createMany({
        data: [
            { host: 'malicious.com', url: 'http://malicious.com/bad', threat_type: 'malware', date_added: new Date() },
            { host: 'phishing-site.com', url: 'http://phishing-site.com/login', threat_type: 'phishing', date_added: new Date() }
        ],
    });
    console.log('Database seeded!');
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());